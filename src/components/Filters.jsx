const TIPOS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'rural', label: 'Rural' },
]

const FAIXAS = [
  { value: '', label: 'Qualquer preço' },
  { value: '0-300000', label: 'Até R$ 300 mil' },
  { value: '300000-600000', label: 'R$ 300 mil - R$ 600 mil' },
  { value: '600000-1000000', label: 'R$ 600 mil - R$ 1 milhão' },
  { value: '1000000-999999999', label: 'Acima de R$ 1 milhão' },
]

export default function Filters({ bairros, values, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <select
        value={values.bairro}
        onChange={(e) => onChange({ ...values, bairro: e.target.value })}
        className="rounded-sm border border-navy/20 bg-white px-3 py-2.5 text-sm text-ink focus:border-blueaccent"
      >
        <option value="">Todos os bairros</option>
        {bairros.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <select
        value={values.tipo}
        onChange={(e) => onChange({ ...values, tipo: e.target.value })}
        className="rounded-sm border border-navy/20 bg-white px-3 py-2.5 text-sm text-ink focus:border-blueaccent"
      >
        {TIPOS.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <select
        value={values.faixa}
        onChange={(e) => onChange({ ...values, faixa: e.target.value })}
        className="rounded-sm border border-navy/20 bg-white px-3 py-2.5 text-sm text-ink focus:border-blueaccent"
      >
        {FAIXAS.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>

      <select
        value={values.quartos}
        onChange={(e) => onChange({ ...values, quartos: e.target.value })}
        className="rounded-sm border border-navy/20 bg-white px-3 py-2.5 text-sm text-ink focus:border-blueaccent"
      >
        <option value="">Quartos (qualquer)</option>
        <option value="1">1+ quarto</option>
        <option value="2">2+ quartos</option>
        <option value="3">3+ quartos</option>
        <option value="4">4+ quartos</option>
      </select>
    </div>
  )
}
