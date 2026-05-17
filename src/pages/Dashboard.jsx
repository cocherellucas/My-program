import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import NextSessionCard from '@/components/dashboard/NextSessionCard';
import ProgramSummaryCard from '@/components/dashboard/ProgramSummaryCard';
import AlertsCard from '@/components/dashboard/AlertsCard';
import StatsRow from '@/components/dashboard/StatsRow';
import CheckIn24h from '@/components/dashboard/CheckIn24h';
import {
  computeDashboardAlerts,
  getSessionsNeedingCheckin,
} from '@/lib/coaching-engine';

const CHECKIN_KEY = 'coaching_checkins';

function loadCheckins() {
  try { return JSON.parse(localStorage.getItem(CHECKIN_KEY)) || {}; } catch { return {}; }
}

function saveCheckin(sessionId, data) {
  const checkins = loadCheckins();
  checkins[sessionId] = { ...data, timestamp: new Date().toISOString() };
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkins));
  return checkins;
}

export default function Dashboard() {
  const navigate  = useNavigate();
  const [user, setUser]       = useState(null);
  const [checkins, setCheckins] = useState(loadCheckins);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (!u.onboarding_completed) navigate('/onboarding');
    });
  }, [navigate]);

  const enabled = !!user?.onboarding_completed;

  const { data: programs = [] } = useQuery({
    queryKey: ['programs'],
    queryFn: () => base44.entities.Program.filter({ status: 'active' }, '-created_date', 1),
    enabled,
  });

  const activeProgram = programs[0] || null;

  const { data: objectives = [] } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => base44.entities.Objective.filter({ status: 'active' }),
    enabled,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', activeProgram?.id],
    queryFn: () => base44.entities.Session.filter({ program_id: activeProgram.id }, 'planned_date'),
    enabled: !!activeProgram,
  });

  const { data: seriesLogs = [] } = useQuery({
    queryKey: ['series-logs-dashboard', user?.id],
    queryFn: () => base44.entities.SeriesLog.filter({ user_id: user.id }, '-created_date', 60),
    enabled: !!user?.id,
  });

  const today       = new Date().toISOString().split('T')[0];
  const nextSession = sessions.find(s => s.status === 'planned' && s.planned_date >= today);

  const alerts = useMemo(() =>
    computeDashboardAlerts({ sessions, program: activeProgram, user: user || {}, checkins, seriesLogs }),
    [sessions, activeProgram, user, checkins, seriesLogs]
  );

  const sessionsNeedingCheckin = useMemo(() =>
    getSessionsNeedingCheckin(sessions, checkins),
    [sessions, checkins]
  );

  const handleCheckin = (sessionId, data) => {
    const updated = saveCheckin(sessionId, data);
    setCheckins(updated);
  };

  if (!user?.onboarding_completed) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">
          Salut{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-white/70 mt-1">Voici ton tableau de bord d'entraînement</p>
      </div>

      <StatsRow sessions={sessions} program={activeProgram} />

      {sessionsNeedingCheckin.length > 0 && (
        <CheckIn24h sessions={sessionsNeedingCheckin} onSubmit={handleCheckin} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NextSessionCard session={nextSession} />
        <ProgramSummaryCard program={activeProgram} objectives={objectives} />
      </div>

      <AlertsCard alerts={alerts} />
    </div>
  );
}
