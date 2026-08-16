import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import PropertyCard from '../components/PropertyCard'
import Filters from '../components/Filters'
import nelsonPhoto from '../assets/nelson-photo.jpg'

export default function Home() {
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ bairro: '', tipo: '', faixa: '', quartos: '' })

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('ativo', true)
        .order('destaque', { ascending: false })
        .order('created_at', { ascending: false })

      if (!active) return
      if (error) {
        setError(error.message)
      } else {
        setImoveis(data || [])
      }
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [])

  const bairros = useMemo(() => {
    const set = new Set(imoveis.map((i) => i.bairro).filter(Boolean))
    return Array.from(set).sort()
  }, [imoveis])

  const filtered = useMemo(() => {
    return imoveis.filter((i) => {
      if (filters.bairro && i.bairro !== filters.bairro) return false
      if (filters.tipo && i.tipo_imovel !== filters.tipo) return false
      if (filters.quartos && (i.quartos || 0) < Number(filters.quartos)) return false
      if (filters.faixa) {
        const [min, max] = filters.faixa.split('-').map(Number)
        const preco = i.preco || 0
        if (preco < min || preco > max) return false
      }
      return true
    })
  }, [imoveis, filters])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <div className="absolute -right-24 top-0 h-full w-2/3 bg-blueaccent [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
        </div>
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 sm:py-20 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              CRECI-SP 326665 · São Paulo
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold italic leading-tight text-white sm:text-5xl">
              Imóveis selecionados,
              <br />
              atendimento direto.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              Cada imóvel abaixo foi selecionado pessoalmente por Nelson Bernardo Júnior.
              Encontrou algo que te interessa? É um clique de distância do WhatsApp dele.
            </p>
          </div>
          <div className="corner-brackets mx-auto aspect-square w-48 overflow-hidden rounded-full border-2 border-gold sm:w-60">
            <img src={nelsonPhoto} alt="Nelson Bernardo Júnior" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Listing */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy">Imóveis disponíveis</h2>
            <p className="text-sm text-muted">
              {loading ? 'Carregando...' : `${filtered.length} imóvel${filtered.length === 1 ? '' : 'is'} encontrado${filtered.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <Filters bairros={bairros} values={filters} onChange={setFilters} />
        </div>

        {error && (
          <p className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Não foi possível carregar os imóveis agora. Tente novamente em instantes.
          </p>
        )}

        {!error && loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-sm bg-lightblue" />
            ))}
          </div>
        )}

        {!error && !loading && filtered.length === 0 && (
          <div className="rounded-sm border border-navy/10 bg-lightblue px-6 py-16 text-center">
            <p className="font-display text-lg italic text-navy">Nenhum imóvel disponível no momento</p>
            <p className="mt-2 text-sm text-muted">Novos imóveis são publicados regularmente. Volte em breve.</p>
          </div>
        )}

        {!error && !loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((imovel) => (
              <PropertyCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
