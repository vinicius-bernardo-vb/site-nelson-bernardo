import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, formatPrice } from '../../lib/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('imoveis')
      .select('*')
      .order('created_at', { ascending: false })
    setImoveis(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleAtivo(imovel) {
    setImoveis((prev) => prev.map((i) => i.id === imovel.id ? { ...i, ativo: !i.ativo } : i))
    const { error } = await supabase
      .from('imoveis')
      .update({ ativo: !imovel.ativo })
      .eq('id', imovel.id)
    if (error) {
      setImoveis((prev) => prev.map((i) => i.id === imovel.id ? { ...i, ativo: imovel.ativo } : i))
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este imóvel permanentemente? Essa ação não pode ser desfeita.')) return
    setDeletingId(id)
    const { error } = await supabase.from('imoveis').delete().eq('id', id)
    setDeletingId(null)
    if (!error) {
      setImoveis((prev) => prev.filter((i) => i.id !== id))
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const filtered = imoveis.filter((i) => {
    const q = search.toLowerCase()
    return i.titulo?.toLowerCase().includes(q) || i.bairro?.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-lightblue">
      <div className="border-b border-navy/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Painel administrativo</p>
            <h1 className="font-display text-xl font-semibold text-navy">Imóveis cadastrados</h1>
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold text-muted hover:text-navy">
            Sair
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Buscar por título ou bairro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-navy/20 bg-white px-3 py-2.5 text-sm focus:border-blueaccent sm:max-w-xs"
          />
          <Link
            to="/admin/imoveis/novo"
            className="inline-flex items-center justify-center rounded-sm bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-blueaccent"
          >
            + Novo imóvel
          </Link>
        </div>

        {loading && <p className="text-muted">Carregando...</p>}

        {!loading && filtered.length === 0 && (
          <p className="rounded-sm border border-navy/10 bg-white px-6 py-12 text-center text-muted">
            Nenhum imóvel encontrado.
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="overflow-hidden rounded-sm border border-navy/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy/5 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Imóvel</th>
                  <th className="px-4 py-3">Bairro</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((imovel) => (
                  <tr key={imovel.id} className="border-t border-navy/5">
                    <td className="px-4 py-3 font-medium text-navy">{imovel.titulo}</td>
                    <td className="px-4 py-3 text-muted">{imovel.bairro || '—'}</td>
                    <td className="px-4 py-3 text-muted">{formatPrice(imovel.preco)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAtivo(imovel)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          imovel.ativo
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {imovel.ativo ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/imoveis/${imovel.id}`}
                        className="mr-4 font-semibold text-blueaccent hover:text-navy"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(imovel.id)}
                        disabled={deletingId === imovel.id}
                        className="font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
