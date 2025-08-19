import { Suspense } from "react";
import ComprarPage from "./ComprarPage";

export default function Page() 
{
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ComprarPage />
        </Suspense>
    );
}