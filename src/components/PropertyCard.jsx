import { Link } from 'react-router-dom'
import { formatPrice, whatsappLink } from '../lib/supabase'

export default function PropertyCard({ imovel }) {
  const capa = imovel.fotos?.[0]
  const link = whatsappLink(
    `Olá Nelson, tenho interesse no imóvel: ${imovel.titulo} - ${imovel.bairro || imovel.endereco || ''}`
  )

  return (
    <div className="group corner-brackets overflow-hidden rounded-sm border border-navy/10 bg-white transition-shadow hover:shadow-xl hover:shadow-navy/10">
      <Link to={`/imovel/${imovel.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-lightblue">
          {capa ? (
            <img
              src={capa}
              alt={imovel.titulo}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              Sem foto
            </div>
          )}
          {imovel.destaque && (
            <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy">
              Destaque
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/imovel/${imovel.id}`}>
          <h3 className="font-display text-lg font-semibold text-navy line-clamp-1">
            {imovel.titulo}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted">
          {imovel.bairro ? `${imovel.bairro}, ` : ''}
          {imovel.cidade || 'São Paulo'}
        </p>

        <p className="mt-3 font-body text-xl font-semibold text-blueaccent">
          {formatPrice(imovel.preco)}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {imovel.quartos ? <span>{imovel.quartos} quartos</span> : null}
          {imovel.banheiros ? <span>{imovel.banheiros} banheiros</span> : null}
          {imovel.vagas ? <span>{imovel.vagas} vagas</span> : null}
          {imovel.area_m2 ? <span>{imovel.area_m2} m²</span> : null}
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 flex w-full items-center justify-center rounded-sm border border-navy bg-navy py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blueaccent"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  )
}
