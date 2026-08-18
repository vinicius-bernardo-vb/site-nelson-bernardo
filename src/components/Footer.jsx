export default function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-lightblue">
      <div className="mx-auto max-w-6xl px-5 py-10 text-center sm:text-left">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="font-display text-lg italic text-navy">Nelson Bernardo Júnior</p>
            <p className="text-sm text-muted">Corretor de Imóveis · CRECI-SP 326665-F</p>
          </div>
          <a
            href="https://www.instagram.com/nelsonbernardo/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blueaccent hover:text-navy"
          >
            @nelsonbernardo no Instagram
          </a>
        </div>
        <p className="mt-6 text-center text-xs text-muted sm:text-left">
          © {new Date().getFullYear()} Nelson Bernardo Júnior. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
