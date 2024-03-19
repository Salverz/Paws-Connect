<script>
    let name = "John"
    let profile_picture = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg/220px-Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg"
    let max = "https://www.millardveterinaryclinics.com/sites/default/files/styles/large/public/breeds/labrador-retriever-dog-breed-info_0.jpg?itok=WekRknuihttps://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.millardveterinaryclinics.com%2Fservices%2Fdogs%2Fbreeds%2Flabrador-retriever&psig=AOvVaw0mJ8dNhtXQsZLqrtnS0xuM&ust=1710905419875000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPDAhMCx_4QDFQAAAAAdAAAAABAEhttps://www.millardveterinaryclinics.com/sites/default/files/styles/large/public/breeds/labrador-retriever-dog-breed-info_0.jpg"

    let pet_list = [
        {
            name: "max",
            age: 10,
            picture: "https://www.millardveterinaryclinics.com/sites/default/files/styles/large/public/breeds/labrador-retriever-dog-breed-info_0.jpg?itok=WekRknuihttps://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.millardveterinaryclinics.com%2Fservices%2Fdogs%2Fbreeds%2Flabrador-retriever&psig=AOvVaw0mJ8dNhtXQsZLqrtnS0xuM&ust=1710905419875000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPDAhMCx_4QDFQAAAAAdAAAAABAEhttps://www.millardveterinaryclinics.com/sites/default/files/styles/large/public/breeds/labrador-retriever-dog-breed-info_0.jpg"
        },
        {
            name: "mittens",
            picture: "https://th-thumbnailer.cdn-si-edu.com/bgmkh2ypz03IkiRR50I-UMaqUQc=/1000x750/filters:no_upscale():focal(1061x707:1062x708)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/55/95/55958815-3a8a-4032-ac7a-ff8c8ec8898a/gettyimages-1067956982.jpg"
        },
        {
            name: "cookie",
            picture: "https://images.saymedia-content.com/.image/t_share/MTk2NzUzNTQ0ODk4OTQ2MTEw/black-and-white-cat-breeds.png"
        }
    ]

</script>

{#each pet_list as pet}
    <h2>{pet.name}</h2>
    <h3>Born in: {2024 - pet.age}</h3>
    <img src="{pet.picture}">
{/each}