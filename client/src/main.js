import { createArticle, getAllArticles, deleteArticle } from "./api/api.js";

document.querySelector("#app").innerHTML = String.raw`
<header>
    <h1>Mark Page</h1>
</header>

<main>
<section id="home">
    <h2>Página Inicial</h2>
    <ul id="article-list"></ul>
</section>

<section id="new-article">
    <h2>Criar Novo Artigo</h2>
    <form id="create-article-form">
        <label for="title">Título:</label>
        <input type="text" id="title" required /><br />
        <label for "content"> Conteúdo: </label>
        <textarea id="content" required></textarea><br />
        <button type="submit">Enviar</button>
    </form>
</section>
</main>

`;

// Função para criar um novo artigo
document.querySelector("#create-article-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;

    try {
        const newArticleData = {
            title,
            text: content
        };

        // Chame a função para criar um novo artigo
        const createdArticle = await createArticle(newArticleData);
        console.log("Artigo criado com sucesso:", createdArticle);

        // Limpe os campos do formulário após a criação do artigo
        document.querySelector("#title").value = "";
        document.querySelector("#content").value = "";

        // Atualize a lista de artigos após a criação do novo artigo
        updateArticleList();
    } catch (error) {
        console.error("Erro ao criar o artigo:", error);
    }
});

// Função para listar todos os artigos
const articleList = document.querySelector("#article-list");

async function updateArticleList() {
    try {
        const articles = await getAllArticles();

        // Limpe a lista de artigos existentes
        articleList.innerHTML = "";

        // Preencha a lista com os novos artigos
        articles.forEach((article) => {
            const li = document.createElement("li");
            li.textContent = `Título: ${article.title}, Conteúdo: ${article.text}`;
            
            // Adicione um botão para excluir o artigo
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Excluir";
            deleteButton.addEventListener("click", async () => {
                try {
                    await deleteArticle(article.title);
                    // Atualize a lista de artigos após a exclusão
                    updateArticleList();
                } catch (error) {
                    console.error("Erro ao excluir o artigo:", error);
                }
            });

            li.appendChild(deleteButton);
            articleList.appendChild(li);
        });

        // Verifique se há artigos para mostrar o botão de exclusão
        if (articles.length === 0) {
            const noArticlesMessage = document.createElement("p");
            noArticlesMessage.textContent = "Nenhum artigo para excluir.";
            articleList.appendChild(noArticlesMessage);
        }
    } catch (error) {
        console.error("Erro ao obter a lista de artigos:", error);
    }
}

// Chame a função para atualizar a lista de artigos quando a página carregar
updateArticleList();
