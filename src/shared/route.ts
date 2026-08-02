import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    // Mock de validação. Em uma aplicação real, valide contra um banco de dados.
    if (email === 'user@example.com' && password === 'password123') {
      // Em uma aplicação real, você criaria uma sessão aqui.
      return NextResponse.json({ message: 'Login bem-sucedido' });
    } else {
      return NextResponse.json({ message: 'E-mail ou senha inválidos.' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}