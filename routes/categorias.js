const express = require('express');
const router = express.Router();
const supabase = require('../data/supabase');

router.get('/', async (req, res, next) => {
    try{
        const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('id', { ascending: true });

        if (error){
        throw error;
        }
        res.json(data);
    }catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try{
        // 1. Busca as categorias para calcular o próximo ID (evita erro de auto-incremento desativado no Supabase)
        const { data: categorias, error: getError } = await supabase
            .from('categorias')
            .select('id');
        if (getError) throw getError;

        const novoId = categorias && categorias.length > 0 
            ? Math.max(...categorias.map(c => c.id)) + 1 
            : 1;

        // 2. Aceita tanto 'nome' (teste manual) quanto 'name' (enviado pelo cozinha.html do front)
        const nomeInserir = req.body.nome || req.body.name;

        const { data, error } = await supabase
            .from('categorias')
            .insert([{ id: novoId, nome: nomeInserir }])
            .select();

        if (error) throw error;
        
        res.status(201).json(data[0]);
    }catch (err) {
        next(err);
    }
});
module.exports = router;
