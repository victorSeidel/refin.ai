import { NextResponse } from "next/server";

const URL = 'https://api.asaas.com/v3';
const SECRET = "$" + process.env.ASAAS_API_KEY!;

export async function POST(req: Request) 
{
    try 
    {
        const body = await req.json();

        const customer = body.customer;
        const value = body.value;

        const cobranca = await criarAsaasCobranca(customer, value);

        const qrCode = await pegarAsaasQrCode(cobranca.id);
        const pix = { image: qrCode.encodedImage, url: qrCode.payload };

        return NextResponse.json({ success: true, cobranca: cobranca.id, pix });
    } 
    catch (error: unknown) 
    {
        console.error('Erro:', error);

        let message = 'Erro interno';
        if (error instanceof Error) message = error.message;

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

async function criarAsaasCobranca(customer: string, value: number)
{
    try
    {
        const body = { customer, billingType: 'PIX', value, dueDate: getNextDueDate() };

        const options = 
        {
            method: 'POST',
            headers: { accept: 'application/json', 'content-type': 'application/json', access_token: SECRET },
            body: JSON.stringify(body)
        };

        const res = await fetch(`${URL}/payments`, options);
        if (!res.ok) { const error = await res.json(); throw new Error(`Erro: ${error.errors?.[0]?.description || res.statusText}`); }

        const data = await res.json();
        return data;
    }
    catch (error: unknown) 
    {
        console.error('Erro:', error);

        let message = 'Erro interno';
        if (error instanceof Error) message = error.message;

        throw new Error(message);
    }
}

async function pegarAsaasQrCode(id: string)
{
    try
    {
        const options = 
        {
            method: 'GET',
            headers: { accept: 'application/json', 'content-type': 'application/json', access_token: SECRET },
        };

        const res = await fetch(`${URL}/payments/${id}/pixQrCode`, options);
        if (!res.ok) { const error = await res.json(); throw new Error(`Erro: ${error.errors?.[0]?.description || res.statusText}`); }

        const data = await res.json();
        return data;
    }
    catch (error: unknown) 
    {
        console.error('Erro:', error);

        let message = 'Erro interno';
        if (error instanceof Error) message = error.message;

        throw new Error(message);
    }
}

function getNextDueDate(daysFromNow = 1) 
{
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}
