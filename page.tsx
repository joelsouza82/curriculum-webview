import React from 'react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Gerenciador de Currículos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300">
          Adicionar Currículo
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300">
          Atualizar Currículo
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300">
          Buscar Currículo
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300">
          Excluir Currículo
        </button>
      </div>
    </main>
  );
}