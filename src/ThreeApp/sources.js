export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg'
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: 'mainCharacterModel',
        type: 'gltfModel',
        path: 'models/MainCharacter/Main.gltf'
    },
    {
        name: 'cityModel',
        type: 'gltfModel',
        path: 'models/city/city_final.gltf'
    },
    {
        name: 'cars',
        type: 'gltfModel',
        path: 'models/city/city-cars2.gltf'
    }
]