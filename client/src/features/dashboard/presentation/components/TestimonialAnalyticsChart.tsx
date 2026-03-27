import type { Testimonial } from "../../../testimonials/domain/Testimonial";

interface AnalyticsMap {
  [testimonialId: string]: { views: number; clicks: number };
}

interface TestimonialAnalyticsChartProps {
  testimonials: Testimonial[];
  analytics: AnalyticsMap;
}

export const TestimonialAnalyticsChart: React.FC<TestimonialAnalyticsChartProps> = ({ testimonials, analytics }) => {
  // Simple bar chart using divs (no external libs)
  const maxViews = Math.max(...testimonials.map(t => analytics[t.id]?.views ?? 0), 1);
  const maxClicks = Math.max(...testimonials.map(t => analytics[t.id]?.clicks ?? 0), 1);

  return (
    <div style={{ margin: '32px 0' }}>
      <h4 style={{ marginBottom: 16 }}>Gráfico de Vistas y Clics por Testimonio</h4>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 180, overflowX: 'auto', paddingBottom: 16 }}>
        {testimonials.map(t => (
          <div key={t.id} style={{ width: 40, textAlign: 'center' }}>
            <div style={{ height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ height: `${(analytics[t.id]?.views ?? 0) / maxViews * 100}px`, background: '#3b82f6', borderRadius: 4, marginBottom: 2 }} title={`Vistas: ${analytics[t.id]?.views ?? 0}`}></div>
              <div style={{ height: `${(analytics[t.id]?.clicks ?? 0) / maxClicks * 100}px`, background: '#f59e0b', borderRadius: 4 }} title={`Clics: ${analytics[t.id]?.clicks ?? 0}`}></div>
            </div>
            <div style={{ fontSize: 10, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 40 }} title={t.content}>{t.content.slice(0, 8)}…</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 12, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 16, height: 8, background: '#3b82f6', display: 'inline-block', borderRadius: 2 }}></span> Vistas</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 16, height: 8, background: '#f59e0b', display: 'inline-block', borderRadius: 2 }}></span> Clics</div>
      </div>
    </div>
  );
};
