const express = require('express');
const router = express.Router();
let supabase = require('../data/supabase');

router.get('/erro-teste', (req, res) => {
    throw new Error("O servidor do Haruy Sushi tropeçou!");
});

router.get('/', async (req, res, next) => {
    try{
        const {categoriaId} = req.query;
        let consulta = supabase.from('produtos').select('*');
        if (categoriaId){
            consulta = consulta.eq('categoriaId', categoriaId);
        }

        const {data, error} = 
        await consulta.order('id', {ascending: true});
        if (error) throw error;
        res.json(data);
    }catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        const{data, error} = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .maybeSingle();

        if (error) throw error;
        if(data){
            res.json(data);
        }else {
            res.status(404).json({mensagem: 'não encontrado'});
        }
    }catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { data, error} = await supabase
        .from('produtos')
        .insert([req.body])
        .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    }catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
   try{
        const {id} = req.params;
        const {data, error} = await supabase
            .from('produtos')
            .update(req.body)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data && data.length > 0){
            res.json(data[0]);
        }else{
            res.status(404).json({mensagem: 'não encontado'});
        }    
   }catch (err){
    next(err);
   }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const {error} = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

        if(error) throw error;
        res.json({mensagem: 'produto deletado'});
     }catch (err){
        next(err);
     }
});

module.exports = router;