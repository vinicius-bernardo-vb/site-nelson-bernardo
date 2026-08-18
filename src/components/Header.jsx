import { Link } from 'react-router-dom'
import { whatsappLink } from '../lib/supabase'
import logoNb from '../assets/logo-nb.png'

export default function Header() {
  const link = whatsappLink('Olá Nelson, vi seu site e quero saber mais sobre imóveis disponíveis')

  return (
    <header className="sticky top-0 z-30 border-b border-navy/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3 leading-none">
          <img src={logoNb} alt="" className="h-9 w-9 opacity-90 sm:h-10 sm:w-10" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold italic text-navy sm:text-2xl">
              Nelson Bernardo Júnior
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">
              Corretor de Imóveis · CRECI-SP 326665-F
            </span>
          </span>
        </Link>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full border border-gold/60 bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blueaccent sm:inline-block"
        >
          Falar no WhatsApp
        </a>
      </div>
    </header>
  )
}
