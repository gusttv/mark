const baseUrl = 'http://localhost:3000';

export async function createArticle(articleData) {
  try {
    const response = await fetch(`${baseUrl}/api/article/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getAllArticles() {
  try {
    const response = await fetch(`${baseUrl}/api/article/`);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteArticle(title) {
    try {
      const response = await fetch(`${baseUrl}/api/article/${title}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
}

