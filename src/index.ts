document.body.innerHTML = `
    <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
`

import("./redgin")

.then( ({ injectStyles, css, html }) => {
    /* 
        * inject global styles to all components 
        */
    injectStyles.push('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">')

    import('../samples/injectStyles/bootStrap')

    document.body.innerHTML = html`
        <btn-bootstrap></btn-bootstrap>
    `

})
.catch((err) => console.log(err))
