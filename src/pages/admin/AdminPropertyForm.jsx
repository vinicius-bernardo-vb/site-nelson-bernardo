import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const EMPTY = {
  titulo: '',
  tipo_imovel: 'apartamento',
  endereco: '',
  bairro: '',
  cidade: 'São Paulo',
  preco: '',
  descricao: '',
  quartos: '',
  banheiros: '',
  vagas: '',
  area_m2: '',
  destaque: false,
  ativo: true,
  fotos: [],
}

export default function AdminPropertyForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEditing) return
    async function load() {
      const { data, error } = await supabase.from('imoveis').select('*').eq('id', id).single()
      if (!error && data) {
        setForm({ ...EMPTY, ...data })
      }
      setLoading(false)
    }
    load()
  }, [id, isEditing])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handlePhotoUpload(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    setError(null)

    const uploadedUrls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('imoveis-fotos')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        setError(`Erro ao subir ${file.name}: ${uploadError.message}`)
        continue
      }

      const { data: publicUrlData } = supabase.storage.from('imoveis-fotos').getPublicUrl(path)
      uploadedUrls.push(publicUrlData.publicUrl)
    }

    setForm((prev) => ({ ...prev, fotos: [...(prev.fotos || []), ...uploadedUrls] }))
    setUploading(false)
    e.target.value = ''
  }

  function removePhoto(url) {
    setForm((prev) => ({ ...prev, fotos: prev.fotos.filter((f) => f !== url) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      titulo: form.titulo,
      tipo_imovel: form.tipo_imovel,
      endereco: form.endereco,
      bairro: form.bairro,
      cidade: form.cidade,
      preco: form.preco ? Number(form.preco) : null,
      descricao: form.descricao,
      quartos: form.quartos ? Number(form.quartos) : null,
      banheiros: form.banheiros ? Number(form.banheiros) : null,
      vagas: form.vagas ? Number(form.vagas) : null,
      area_m2: form.area_m2 ? Number(form.area_m2) : null,
      destaque: form.destaque,
      ativo: form.ativo,
      fotos: form.fotos,
    }

    const query = isEditing
      ? supabase.from('imoveis').update(payload).eq('id', id)
      : supabase.from('imoveis').insert(payload)

    const { error } = await query
    setSaving(false)

    if (error) {
      setError(error.message)
    } else {
      navigate('/admin')
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-lightblue">
      <div className="border-b border-navy/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-5">
          <Link to="/admin" className="text-sm font-semibold text-blueaccent hover:text-navy">
            ← Voltar
          </Link>
          <h1 className="mt-2 font-display text-xl font-semibold text-navy">
            {isEditing ? 'Editar imóvel' : 'Novo imóvel'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 px-5 py-8">
        <div className="rounded-sm border border-navy/10 bg-white p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink">Título</label>
              <input
                required
                value={form.titulo}
                onChange={(e) => updateField('titulo', e.target.value)}
                placeholder="Ex: Apartamento 3 quartos com varanda"
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Tipo</label>
              <select
                value={form.tipo_imovel}
                onChange={(e) => updateField('tipo_imovel', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              >
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="terreno">Terreno</option>
                <option value="comercial">Comercial</option>
                <option value="rural">Rural</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Preço (R$)</label>
              <input
                type="number"
                value={form.preco}
                onChange={(e) => updateField('preco', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Endereço</label>
              <input
                value={form.endereco}
                onChange={(e) => updateField('endereco', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Bairro</label>
              <input
                value={form.bairro}
                onChange={(e) => updateField('bairro', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Cidade</label>
              <input
                value={form.cidade}
                onChange={(e) => updateField('cidade', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Quartos</label>
              <input
                type="number"
                value={form.quartos}
                onChange={(e) => updateField('quartos', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Banheiros</label>
              <input
                type="number"
                value={form.banheiros}
                onChange={(e) => updateField('banheiros', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Vagas</label>
              <input
                type="number"
                value={form.vagas}
                onChange={(e) => updateField('vagas', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Área (m²)</label>
              <input
                type="number"
                value={form.area_m2}
                onChange={(e) => updateField('area_m2', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink">Descrição</label>
              <textarea
                rows={4}
                value={form.descricao}
                onChange={(e) => updateField('descricao', e.target.value)}
                className="mt-1 w-full rounded-sm border border-navy/20 px-3 py-2.5 text-sm focus:border-blueaccent"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.destaque}
                onChange={(e) => updateField('destaque', e.target.checked)}
              />
              Destaque na home
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => updateField('ativo', e.target.checked)}
              />
              Ativo (visível no site)
            </label>
          </div>
        </div>

        <div className="rounded-sm border border-navy/10 bg-white p-6">
          <label className="block text-sm font-medium text-ink">Fotos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            disabled={uploading}
            className="mt-2 block text-sm"
          />
          {uploading && <p className="mt-2 text-sm text-muted">Enviando fotos...</p>}

          {form.fotos?.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.fotos.map((url) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-sm border border-navy/10">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-sm bg-navy py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blueaccent disabled:opacity-60"
        >
          {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar imóvel'}
        </button>
      </form>
    </div>
  )
}
