<script lang="ts">
    export let data: { projects?: any[] };
  
    // garantit que `projects` est toujours un tableau
    const projects = data.projects ?? [];
</script>

<main class="p-8">
<h1 class="text-2xl font-bold mb-4">Mes projets</h1>

{#if projects.length === 0}
    <p>Aucun projet trouvé.</p>
{:else}
    <ul>
    {#each projects as p}
        <li class="border-b py-2">
        <h2>{@html p.title.rendered}</h2>
        <p>{@html p.acf.description}</p>
        {#if p.acf.project_link}
            <a href={p.acf.project_link} target="_blank">Voir en ligne</a>
        {/if}
        </li>
    {/each}
    </ul>
{/if}
</main>
  