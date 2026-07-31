export async function getPersonals() {
  try {
    const response = await fetch('/api/personals', { // Usando o endpoint do proxy
      cache: 'no-store',
    });
    if (!response.ok) {
      const errorBody = await response.text(); // Tenta ler o corpo da resposta para mais detalhes
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching personals:", error);
    throw error;
  }
}