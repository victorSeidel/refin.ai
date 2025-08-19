import { NextResponse } from "next/server";

const URL = 'https://api.asaas.com/v3';
const SECRET = "$" + process.env.ASAAS_API_KEY!;

export async function POST(req: Request) 
{
    try 
    {
        const body = await req.json();

        const name    = body.name;
        const cpfCnpj = body.cpfCnpj;

        let customer = null;

        customer = await pegarAsaasCustomer(cpfCnpj);
        if (customer) return NextResponse.json({ success: true, customer: customer.id });

        customer = await criarAsaasCustomer(name, cpfCnpj);

        return NextResponse.json({ success: true, customer: customer.id });
    } 
    catch (error: unknown) 
    {
        console.error('Erro:', error);

        let message = 'Erro interno';
        if (error instanceof Error) message = error.message;

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

async function pegarAsaasCustomer(cpfCnpj: string)
{
    try
    {
        const options = 
        {
            method: 'GET',
            headers: { accept: 'application/json', 'content-type': 'application/json', access_token: SECRET },
        };

        const res = await fetch(`${URL}/customers?cpfCnpj=${cpfCnpj}`, options);
        if (!res.ok) { const error = await res.json(); throw new Error(`Erro: ${error.errors?.[0]?.description || res.statusText}`); }

        const data = await res.json();
        return data.data[0];
    }
    catch (error: unknown) 
    {
        console.error('Erro:', error);

        let message = 'Erro interno';
        if (error instanceof Error) message = error.message;

        throw new Error(message);
    }
}

async function criarAsaasCustomer(name: string, cpfCnpj: string)
{
    try
    {
        const body = { name, cpfCnpj, notificationDisabled: false };

        const options = 
        {
            method: 'POST',
            headers: { accept: 'application/json', 'content-type': 'application/json', access_token: SECRET },
            body: JSON.stringify(body)
        };

        const res = await fetch(`${URL}/customers`, options);
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
