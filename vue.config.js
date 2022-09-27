module.exports = {
    pages: {
        'index': {
            entry: './src/pages/Index/main.js',
            template: 'public/index.html',
            title: 'Game Theory and Philosophy',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
        'payoffmatrixdemo': {
            entry: './src/pages/PayoffMatrix/main.js',
            template: 'public/index.html',
            title: 'PayoffMatrix Component Demonstration',
            chunks: ['chunk-vendors', 'chunk-common', 'payoffmatrixdemo'],
        },
        'hobbes': {
            entry: './src/pages/Hobbes/main.js',
            template: 'public/index.html',
            title: 'Hobbes',
            chunks: ['chunk-vendors', 'chunk-common', 'hobbes'],
        },
    }
}