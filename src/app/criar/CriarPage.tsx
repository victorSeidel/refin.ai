'use client'
import React, { useEffect, useState } from 'react'

import { Pacote, pacotes } from '@/models/pacotes';

export default function CriarPage()
{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [cobranca, setCobranca] = useState();
    const [pacote, setPacote] = useState<Pacote>();

    useEffect(() => 
    {
        const fetchData = async () =>
        {
            const cobranca = localStorage.getItem("cobranca");

            if (!cobranca)
            {
                window.location.href = '/comprar';
                return;
            }

            const dados = JSON.parse(cobranca);

            const res = await fetch(`/api/verificar-cobranca?id=${dados.cobranca}`, { method: "POST" });
            const data = await res.json();

            if (data.success && data.status === 'CONFIRMED' && dados.success && data.value === dados.pacote) 
            {
                setCobranca(dados);

                const pacote = pacotes.find(p => p.valor === dados.pacote);
                if (!pacote) { setError('Erro ao localizar pacote.'); return; }
                setPacote(pacote);

                return;
            }

            setError('Erro ao verificar seu pagamento.');
        }
        
        fetchData();

    }, []);

    const [files, setFiles] = useState<File[]>([]);
    const [results, setResults] = useState<{ file: File; url: string | null; loading: boolean }[]>([]);
    const [resolucao, setResolucao] = useState<'auto' | '1024x1024' | '1536x1024' | '1024x1536'>('auto');

    async function handleSubmit(e: React.FormEvent) 
    {
        e.preventDefault();

        if (!pacote) return;

        const limite = pacote.imagens;

        if (files.length !== limite) { setError('Selecione TODAS as suas imagens.'); return; }

        if (files.length > limite) { setError(`Você pode enviar no máximo ${limite} imagens.`); return; }

        setLoading(true);
        setResults(files.map(file => ({ file, url: null, loading: true })));

        for (let i = 0; i < files.length; i++)
        {
            const file = files[i];

            const formData = new FormData();
            formData.append('file', file);
            formData.append('resolucao', resolucao);

            try 
            {
                const res = await fetch('/api/gerar-imagem', { method: 'POST', body: formData });
                if (!res.ok) throw new Error('Erro ao processar imagem');

                const data = await res.json();
                if (!data.base64) throw new Error('Erro ao receber a imagem');
                
                const base64 = data.base64;
                const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: 'image/png' });
                const url = URL.createObjectURL(blob);
                setResults(prev => prev.map(r => r.file === file ? { ...r, url, loading: false } : r));
            } 
            catch (err) 
            {
                console.error(err);
                alert('Erro ao processar imagem');
                setResults(prev => prev.map(r => r.file === file ? { ...r, url: null, loading: false } : r));
            } 
        }

        localStorage.clear();
        setLoading(false);
    }

    return (
        <>
        {error && (
            <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-950">
                <p className="max-w-xl p-4 bg-red-700 text-white rounded-lg shadow-md break-words">
                    {error}
                </p>
            </div>
        )}

        {cobranca && pacote && (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-950 text-gray-100">

                <div className="mb-4">
                    <h2 className="text-2xl text-amber-400">Pacote {pacote.nome}</h2>
                    <p className="text-lg text-orange-500 text-center">Envie {pacote.imagens} imagens</p>
                </div>

                <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-2xl shadow-lg shadow-amber-500/10 p-8 flex flex-col gap-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div className="flex flex-col gap-2 relative">
                            <label className="block text-sm font-medium text-gray-300">Selecione suas imagens (Formatos aceitos: JPEG e PNG)</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col w-full h-32 border-2 border-dashed border-amber-500 hover:border-amber-400 rounded-lg cursor-pointer transition-all duration-300 bg-gray-800/80 hover:bg-gray-700">
                                    <div className="flex flex-col items-center justify-center pt-7">
                                        <svg className="w-8 h-8 text-amber-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <p className="pt-1 text-sm text-gray-300">
                                            {files.length ? `${files.length} imagens selecionadas` : 'Arraste ou clique para selecionar suas imagens'}
                                        </p>
                                    </div>
                                    <input type="file" accept="image/jpeg, image/png" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"/>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="block text-sm font-medium text-gray-300">Resolução</span>
                            <div className="flex gap-4 flex-wrap">
                                {['auto', '1024x1024', '1536x1024', '1024x1536'].map((r) => (
                                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="resolucao" value={r} checked={resolucao === r} onChange={() => setResolucao(r as typeof resolucao)}
                                            className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-700 bg-gray-800"/>
                                        <span className="text-gray-100">
                                            {r === 'auto' ? 'Manter' : r === '1024x1024' ? '1024x1024 (Quadrada)' 
                                                : r === '1536x1024' ? '1536x1024 (Horizontal)' : '1024x1536 (Vertical)'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                                className="cursor-pointer w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            {loading ? 'Processando...' : 'Enviar'}
                        </button>
                    </form>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {results.map(r => (
                            <div key={r.file.name} className="text-center">
                                {r.loading && <p className="text-gray-300">Processando {r.file.name}...</p>}
                                {r.url && <img src={r.url} width={320} height={180} alt={r.file.name} className="max-w-full rounded shadow-md"/>}
                                {r.url && (
                                    <a href={r.url} download={r.file.name}
                                        className="block mt-2 w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-amber-600 hover:to-orange-700">
                                        Baixar
                                    </a>
                                )}
                                {!r.loading && !r.url && ( <p className="text-red-500 font-medium">Falha ao processar {r.file.name}</p> )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        )}
        </>
    );
}