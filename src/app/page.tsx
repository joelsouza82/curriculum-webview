import React from 'react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-12">Gerenciador de Currículos</h1>
      </div>

      <div className="w-full max-w-lg grid grid-cols-2 gap-8">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-10 px-8 rounded-lg shadow-lg transition duration-300">
          Adicionar Currículo
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-10 px-8 rounded-lg shadow-lg transition duration-300">
          Atualizar Currículo
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-10 px-8 rounded-lg shadow-lg transition duration-300">
          Buscar Currículo
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-10 px-8 rounded-lg shadow-lg transition duration-300">
          Excluir Currículo
        </button>
      </div>
    </main>
  );
}
