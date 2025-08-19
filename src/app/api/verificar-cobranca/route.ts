import { NextResponse } from "next/server";

const url = 'https://api.asaas.com/v3';
const SECRET = "$" + process.env.ASAAS_API_KEY!;

export async function POST(req: Request) 
{
    try 
    {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) 
        { 
            const data = await verificarAsaasCobrancaSemId();
            return NextResponse.json({ error: 'ID não informado ou inválido', success: false, cobranca: data }, { status: 400 }); 
        }

        const data = await verificarAsaasCobranca(id);

        return NextResponse.json({ success: true, status: data.status, value: data.value });
    } 
    catch (error: unknown) 
    {
        console.error('Erro:', error);

        let message = 'Erro interno';
        if (error instanceof Error) message = error.message;

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

async function verificarAsaasCobranca(id: string)
{
    try
    {
        const options = 
        {
            method: 'GET',
            headers: { accept: 'application/json', 'content-type': 'application/json', access_token: SECRET },
        };

        const res = await fetch(`${url}/payments/${id}`, options);
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

async function verificarAsaasCobrancaSemId()
{
    try
    {
        const options = 
        {
            method: 'GET',
            headers: { accept: 'application/json', 'content-type': 'application/json', access_token: SECRET },
        };

        const res = await fetch(`${url}/payments`, options);
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
