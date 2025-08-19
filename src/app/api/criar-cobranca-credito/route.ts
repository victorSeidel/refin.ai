import { NextResponse } from "next/server";

const URL = 'https://api.asaas.com/v3';
const SECRET = "$" + process.env.ASAAS_API_KEY!;

interface CreditCard { holderName: string, number: string, expiryMonth: string, expiryYear: string, ccv: string };
interface CreditCardHolderInfo { name: string, email: string, cpfCnpj: string, postalCode: string, addressNumber: string, phone: string };

export async function POST(req: Request) 
{
    try 
    {
        const body = await req.json();

        const customer = body.customer;
        const value = body.value;

        const creditCard: CreditCard = 
        {
            holderName: body.name,
            number: body.cardNumber,
            expiryMonth: body.cardExpiryMonth,
            expiryYear: body.cardExpiryYear,
            ccv: body.cardCvv
        };

        const creditCardHolderInfo: CreditCardHolderInfo = 
        {
            name: body.name,
            email: body.email,
            cpfCnpj: body.cpfCnpj,
            postalCode: body.postalCode,
            addressNumber: body.addressNumber,
            phone: body.phone,
        };

        const remoteIp = getRemoteIp(req);

        const cobranca = await criarAsaasCobranca(customer, value, creditCard, creditCardHolderInfo, remoteIp);

        return NextResponse.json({ success: true, cobranca: cobranca.id });
    } 
    catch (error: unknown) 
    {
        console.error('Erro:', error);

        let message = 'Erro interno';
        if (error instanceof Error) message = error.message;

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

async function criarAsaasCobranca(customer: string, value: number, creditCard: CreditCard, creditCardHolderInfo: CreditCardHolderInfo, remoteIp: string)
{
    try
    {
        const body = 
        { 
            customer, 
            billingType: 'CREDIT_CARD', 
            value, 
            dueDate: getNextDueDate(),
            creditCard,
            creditCardHolderInfo,
            remoteIp,
        };

        console.log(body);

        const options = 
        {
            method: 'POST',
            headers: { accept: 'application/json', 'content-type': 'application/json', access_token: SECRET },
            body: JSON.stringify(body)
        };

        const res = await fetch(`${URL}/payments`, options);
        if (!res.ok) { const error = await res.json(); throw new Error(`${error.errors?.[0]?.description || res.statusText}`); }

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

function getRemoteIp(req: Request): string 
{
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) return forwardedFor.split(',')[0].trim();

    return req.headers.get('x-real-ip') || '';
}