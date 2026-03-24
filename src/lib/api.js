const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getBootstrap: () => request('/api/bootstrap'),
  addInventoryItem: (item) =>
    request('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(item)
    }),
  updateInventoryItem: (id, updates) =>
    request(`/api/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
  deleteInventoryItem: (id) =>
    request(`/api/inventory/${id}`, {
      method: 'DELETE'
    }),
  addCookingHistory: (entry) =>
    request('/api/cooking-history', {
      method: 'POST',
      body: JSON.stringify(entry)
    }),
  addShoppingListItems: (items) =>
    request('/api/shopping-list', {
      method: 'POST',
      body: JSON.stringify({ items })
    }),
  updateShoppingListItem: (id, updates) =>
    request(`/api/shopping-list/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
  deleteShoppingListItem: (id) =>
    request(`/api/shopping-list/${id}`, {
      method: 'DELETE'
    }),
  getRecommendations: (inventorySnapshot) =>
    request('/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ inventorySnapshot })
    }),
  getSubstitutions: (recipeId, missingIngredients) =>
    request('/api/ai/substitutions', {
      method: 'POST',
      body: JSON.stringify({ recipeId, missingIngredients })
    }),
  askCookingQuestion: (payload) =>
    request('/api/ai/qa', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export { API_BASE };
