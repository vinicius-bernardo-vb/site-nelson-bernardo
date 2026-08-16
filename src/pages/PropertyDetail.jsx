import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, formatPrice, whatsappLink } from '../lib/supabase'

export default function PropertyDetail() {
  const { id } = useParams()
  const [imovel, setImovel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .maybeSingle()

      if (!active) return
      if (error || !data) {
        setNotFound(true)
      } else {
        setImovel(data)
      }
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [id])

  if (loading) {
    return <div className="mx-auto max-w-5xl px-5 py-16 text-center text-muted">Carregando...</div>
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-20 text-center">
        <p className="font-display text-xl italic text-navy">Este imóvel não está mais disponível</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-blueaccent hover:text-navy">
          ← Voltar para a vitrine
        </Link>
      </div>
    )
  }

  const fotos = imovel.fotos?.length ? imovel.fotos : []
  const link = whatsappLink(
    `Olá Nelson, tenho interesse no imóvel: ${imovel.titulo} - ${imovel.bairro || imovel.endereco || ''}`
  )

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link to="/" className="text-sm font-semibold text-blueaccent hover:text-navy">
        ← Voltar para a vitrine
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="corner-brackets aspect-[4/3] overflow-hidden rounded-sm bg-lightblue">
            {fotos.length > 0 ? (
              <img src={fotos[activePhoto]} alt={imovel.titulo} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">Sem fotos</div>
            )}
          </div>
          {fotos.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {fotos.map((f, i) => (
                <button
                  key={f + i}
                  onClick={() => setActivePhoto(i)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-sm border-2 ${
                    i === activePhoto ? 'border-gold' : 'border-transparent'
                  }`}
                >
                  <img src={f} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {imovel.destaque && (
            <span className="inline-block rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy">
              Destaque
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl font-semibold text-navy">{imovel.titulo}</h1>
          <p className="mt-1 text-muted">
            {imovel.endereco ? `${imovel.endereco} · ` : ''}
            {imovel.bairro ? `${imovel.bairro}, ` : ''}
            {imovel.cidade || 'São Paulo'}
          </p>

          <p className="mt-5 font-display text-3xl font-semibold text-blueaccent">
            {formatPrice(imovel.preco)}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {imovel.quartos ? (
              <div className="rounded-sm border border-navy/10 bg-lightblue px-4 py-3">
                <p className="text-muted">Quartos</p>
                <p className="font-semibold text-navy">{imovel.quartos}</p>
              </div>
            ) : null}
            {imovel.banheiros ? (
              <div className="rounded-sm border border-navy/10 bg-lightblue px-4 py-3">
                <p className="text-muted">Banheiros</p>
                <p className="font-semibold text-navy">{imovel.banheiros}</p>
              </div>
            ) : null}
            {imovel.vagas ? (
              <div className="rounded-sm border border-navy/10 bg-lightblue px-4 py-3">
                <p className="text-muted">Vagas</p>
                <p className="font-semibold text-navy">{imovel.vagas}</p>
              </div>
            ) : null}
            {imovel.area_m2 ? (
              <div className="rounded-sm border border-navy/10 bg-lightblue px-4 py-3">
                <p className="text-muted">Área</p>
                <p className="font-semibold text-navy">{imovel.area_m2} m²</p>
              </div>
            ) : null}
          </div>

          {imovel.descricao && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink/80">
              {imovel.descricao}
            </p>
          )}

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center rounded-sm border border-navy bg-navy py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blueaccent"
          >
            Falar no WhatsApp sobre este imóvel
          </a>
        </div>
      </div>
    </div>
  )
}
