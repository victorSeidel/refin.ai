'use client'
import React, { useState } from 'react'
import { useSearchParams } from "next/navigation";
import { Lock } from 'lucide-react'

interface PixResponse { image: string; url: string; }

import { pacotes } from '@/models/pacotes';

export default function ComprarPage()
{
    const searchParams = useSearchParams();
    const pacoteIdParam = Number(searchParams.get("pacote")) || 3;
    const [pacoteId, setPacoteId] = useState(pacoteIdParam);
    const pacote = pacotes.find(p => p.id === pacoteIdParam) || pacotes[2];

    const [loading, setLoading] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState("PIX");
    const [qrCode, setQrCode] = useState<PixResponse | null>(null);

    const [form, setForm] = useState({
        value: pacote.valor,
        name: "",
        email: "",
        cpfCnpj: "",
        postalCode: "",
        addressNumber: "",
        phone: "",
        cardNumber: "",
        cardExpiryMonth: "",
        cardExpiryYear: "",
        cardCvv: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setForm({ ...form, [e.target.name]: e.target.value }); };

    const handleSubmit = async (e: React.FormEvent) => 
    {
        e.preventDefault();

        setLoading(true);
        setQrCode(null);

        try 
        {
            const resCus = await fetch("/api/pegar-asaas-customer", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, cpfCnpj: form.cpfCnpj }),
            });

            const dataCus = await resCus.json();
            if (!dataCus.success) throw new Error(dataCus.error);
            const customer = dataCus.customer;

            if (paymentMethod === "PIX") 
            {
                const res = await fetch("/api/criar-cobranca-pix", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ customer, value: form.value }),
                });

                const data = await res.json();
                if (data.success) 
                {
                    localStorage.setItem("cobranca", JSON.stringify({ cobranca: data.cobranca, pacote: form.value, success: false }));

                    setQrCode(data.pix);
                    pollStatus(data.cobranca);
                } 
                else 
                {
                    throw new Error(data.error);
                }
            } 
            else 
            {
                const res = await fetch("/api/criar-cobranca-credito", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ customer, ...form }),
                });

                const data = await res.json();
                if (data.success) 
                {
                    localStorage.setItem("cobranca", JSON.stringify({ cobranca: data.cobranca, pacote: form.value, success: false }));
                    
                    pollStatus(data.cobranca);
                } 
                else 
                {
                    throw new Error(data.error);
                }
            }
        } 
        catch (error: unknown) 
        {
            let message = 'Erro ao criar pagamento';
            if (error instanceof Error) message = error.message;
            alert(message);

            setLoading(false);
        }
    };

    const pollStatus = async (id: string) => 
    {
        const interval = setInterval(async () => 
        {
            const res = await fetch(`/api/verificar-cobranca?id=${id}`, { method: "POST" });
            const data = await res.json();
            if (data.success && data.status === "CONFIRMED") 
            {
                clearInterval(interval);

                localStorage.setItem("cobranca", JSON.stringify({ cobranca: id, pacote: form.value, success: true }));

                setLoading(false);

                window.location.href = '/criar';
            }
        }, 5000);
    };

    const copyToClipboard = () => { navigator.clipboard.writeText(qrCode?.url || '').then(() => { alert('Link copiado!');}).catch(() => { alert('Erro ao copiar link.'); }); }

    return (
        <>
        {!loading
        ?
        (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center px-4 py-8">

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {pacotes.map(pacote => (
                    <div key={pacote.id} className="rounded-lg border border-amber-400 p-8">
                        <h2 className="text-2xl text-amber-400">Pacote {pacote.nome}</h2>
                        <p className="text-lg text-orange-500 text-center">{pacote.imagens} imagens - R$ {pacote.valor}</p>
                        <button onClick={() => { setPacoteId(pacote.id) }}
                                className={`cursor-pointer w-full shadow-lg ${pacote.id === pacoteId 
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 hover:shadow-amber-500/30' 
                                    : 'bg-gray-900 hover:bg-gray-800 shadow-none'}
                                    text-white font-semibold px-6 py-2 mt-4 rounded-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all`}>
                            {pacote.id === pacoteId ? 'Selecionado' : 'Selecionar'}
                        </button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl shadow-lg shadow-amber-500/10 p-8 space-y-4">

                <div className="flex justify-center items-center mb-6">
                    <Lock className="w-5 h-5 mr-2" /> 
                    <h3 className="text-xl font-bold text-center text-white">Pagamento Seguro</h3>
                </div>                
                
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                    <input name="name" value={form.name} onChange={handleChange} required 
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">CPF/CNPJ</label>
                    <input name="cpfCnpj" value={form.cpfCnpj} onChange={handleChange} maxLength={14} placeholder='12345678900' required 
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Método de Pagamento</label>
                    <div className="flex gap-8">
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="paymentMethod" value="PIX" checked={paymentMethod === "PIX"} onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-700 bg-gray-800"/>
                            <span className="text-gray-100">PIX</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input type="radio" name="paymentMethod" value="CREDIT_CARD" checked={paymentMethod === "CREDIT_CARD"} onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-700 bg-gray-800"/>
                            <span className="text-gray-100">Cartão de Crédito</span>
                        </label>
                    </div>
                </div>

                {paymentMethod === "CREDIT_CARD" && (
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Número do cartão</label>
                            <input name="cardNumber" value={form.cardNumber} onChange={handleChange} maxLength={16} required
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Mês de Expiração</label>
                                <input name="cardExpiryMonth" value={form.cardExpiryMonth} onChange={handleChange} maxLength={2} placeholder='12' required 
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Ano de Expiração</label>
                                <input name="cardExpiryYear" value={form.cardExpiryYear} onChange={handleChange} maxLength={4} placeholder='2032' required 
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Código de Segurança</label>
                                <input name="cardCvv" value={form.cardCvv} onChange={handleChange} maxLength={4} placeholder='081' required
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder='nome@email.com' required
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength={11} placeholder='11999999999' required
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">CEP da Residência</label>
                                <input name="postalCode" value={form.postalCode} onChange={handleChange} maxLength={8} placeholder='31321123' required
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Número da Residência</label>
                                <input name="addressNumber" value={form.addressNumber} onChange={handleChange} placeholder='44' required
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"/>
                            </div>
                        </div>
                    </div>
                )}

                <button type="submit"
                        className="cursor-pointer w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
                            text-white font-semibold px-6 py-3 mt-2 rounded-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                    {paymentMethod === "CREDIT_CARD" ? 'Confirmar pagamento' : 'Ir para o pagamento'}
                </button>
            </form>
        </div>
        )
        :
        (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-100 px-4">
            <p className="text-lg text-amber-400 font-medium">Aguardando pagamento... <br/> Não feche ou recarregue essa página.</p>

            {paymentMethod === "PIX" && (
                <>
                {qrCode 
                ?
                    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg shadow-amber-500/10 text-center">
                        <h2 className="text-xl font-bold text-white mb-4">Escaneie o QR Code</h2>
                        <img src={`data:image/png;base64,${qrCode.image}`} alt="QR Code PIX" width={250} height={250} className="mx-auto rounded-lg shadow-md"/>
                        <p className="mt-4 text-gray-300">Ou copie e use este link:</p>
                        <button onClick={copyToClipboard} className="cursor-pointer text-amber-400 break-words underline">{qrCode.url}</button>
                    </div>
                :
                    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg shadow-amber-500/10 text-center">
                        <p className="text-xl text-amber-400 font-medium">Gerando seu código...</p>
                    </div>
                }
                </>
            )}
        </div>
        )}
        </>
    );
}