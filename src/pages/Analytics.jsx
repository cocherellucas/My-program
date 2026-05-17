import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Analytics() {
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: sessions = [] } = useQuery({
    queryKey: ['all-sessions'],
    queryFn: () => base44.entities.Session.filter({ status: 'completed' }, '-actual_date', 50),
    enabled: !!user,
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['all-logs'],
    queryFn: () => base44.entities.SeriesLog.filter({ user_id: user.id }, '-created_date', 200),
    enabled: !!user,
  });

  const { data: measurements = [] } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => base44.entities.Measurement.filter({ user_id: user.id }, 'date'),
    enabled: !!user,
  });

  // Fatigue chart data
  const fatigueData = sessions
    .filter(s => s.global_fatigue)
    .map(s => ({
      date: s.actual_date ? format(new Date(s.actual_date), 'dd/MM') : '',
      fatigue: s.global_fatigue,
    }))
    .reverse();

  // Adherence
  const totalPlanned = sessions.length;
  const totalCompleted = sessions.filter(s => s.status === 'completed').length;

  // Progress by exercise (top weight per exercise over time)
  const exerciseProgress = {};
  logs.forEach(log => {
    if (!exerciseProgress[log.exercise_name]) exerciseProgress[log.exercise_name] = [];
    exerciseProgress[log.exercise_name].push({
      weight: log.weight,
      reps: log.reps_done,
      date: log.created_date,
    });
  });

  const topExercises = Object.entries(exerciseProgress)
    .sort(([,a], [,b]) => b.length - a.length)
    .slice(0, 4);

  // Measurements data
  const measData = measurements.map(m => ({
    date: m.date ? format(new Date(m.date), 'dd/MM') : '',
    rightArm: m.right_arm,
    leftArm: m.left_arm,
    waist: m.waist,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Statistiques</h1>
        <p className="text-white/70 mt-1">Suis ta progression et tes performances</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Séances totales', value: totalCompleted },
          { label: 'Séries enregistrées', value: logs.length },
          { label: 'Adhérence', value: totalPlanned > 0 ? `${Math.round(totalCompleted / totalPlanned * 100)}%` : '—' },
          { label: 'Mesures', value: measurements.length },
        ].map(({ label, value }) => (
          <Card key={label} className="p-4 text-center bg-white/15 backdrop-blur-sm border-white/20">
            <p className="text-2xl font-heading font-bold text-white">{value}</p>
            <p className="text-xs text-white/60">{label}</p>
          </Card>
        ))}
      </div>

      {/* Fatigue trend */}
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-bold text-lg mb-4 text-white">Fatigue globale</h3>
        {fatigueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={fatigueData}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }} />
              <Tooltip contentStyle={{ background: 'rgba(109,40,217,0.9)', border: 'none', color: '#fff', borderRadius: 8 }} />
              <Line type="monotone" dataKey="fatigue" stroke="#fff" strokeWidth={2} dot={{ r: 3, fill: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-white/60 text-center py-8">Pas encore de données de fatigue</p>
        )}
      </Card>





      {sessions.length === 0 && (
        <Card className="p-12 text-center bg-white/15 backdrop-blur-sm border-white/20">
          <p className="text-white/70">Complète quelques séances pour voir tes statistiques ici.</p>
        </Card>
      )}
    </div>
  );
}