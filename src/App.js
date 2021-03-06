import React, { useState, useEffect } from 'react';
import api from './api';
import {
    makeStyles,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Table,
    TableRow,
    TableCell,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    TableHead,
    DialogActions
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';


function App() {

    const [lista, setLista] = useState([]); //imutabilidade
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [id, setId] = useState('');
    const [autor, setAutor] = useState('');
    const [titulo, setTitulo] = useState('');
    const [anopublic, setAnopbublic] = useState('');
    const [checked, setChecked] = useState(true);

    function listaLivros() {
        api.get('/livros').then((response) => {
            const itens = response.data;
            setLista(itens);
            setLoading(false);
        })
    }

    useEffect(() => { //construtor, executado "uma única vez"
        listaLivros();
    }, [])

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const openModal1 = () => setOpen1(true);
    const closeModal1 = () => setOpen1(false);

    function addLivro() {
        const name = autor;
        const title = titulo;
        const number = anopublic;

        api.post('/livros', { autor: name, titulo: title, anopublic: number }).then((response) => {
            setAutor('');
            setTitulo('');
            setAnopbublic('');
            setChecked(true);
            setOpen(false);
            listaLivros();
        });
    }

    function alterarLivro(){
        const code = id;
        const name = autor;
        const title = titulo;
        const number = anopublic;

        api.put(`/livros/${code}`, { autor: name, titulo: title, anopublic: number }).then((response) => {
            setAutor('');
            setTitulo('');
            setAnopbublic('');
            setChecked(true);
            setOpen1(false);
            listaLivros();
        });
    }

    function deletarLivro(id) {
        api.delete(`/livros/${id}`).then((response) => {
            listaLivros();
        });
    }

    function marcarLido(id, lido) {
        if (lido == true) {
            api.patch(`/livros/${id}/nlido`).then((response) => {
                listaLivros();
            });
        } else {
            api.patch(`/livros/${id}/lido`).then((response) => {
                listaLivros();
            });
        }
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }));

    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title} color="#128cff">
                            Tela Inicial
          </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </div>
            {loading ? <span>Carregando dados...</span> : <div />}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell> <b>Código</b> </TableCell>
                        <TableCell> <b>Autor</b> </TableCell>
                        <TableCell> <b>Titulo</b> </TableCell>
                        <TableCell> <b>Ano</b> </TableCell>
                        <TableCell> <b>Lido</b> </TableCell>
                        <TableCell> <b>Não Quero Mais Ler</b> </TableCell>
                        <TableCell> <b>Preciso Ajustar Algo</b> </TableCell>
                    </TableRow>
                </TableHead>
                {lista.map(item => (
                    <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.autor}</TableCell>
                        <TableCell>{item.titulo}</TableCell>
                        <TableCell>{item.anopublic}</TableCell>
                        <TableCell>
                            <input
                                type="checkbox"
                                onChange={() => marcarLido(item.id, item.lido)}
                                checked={item.lido == true ? true : false} />
                        </TableCell>
                        <TableCell>
                            <Button
                                onClick={() => deletarLivro(item.id)}
                                variant="outlined"
                                size="small"
                                color="secondary">Deletar</Button>
                        </TableCell>
                        <TableCell>
                            <Button
                                onClick={openModal1}
                                variant="outlined"
                                size="small"
                                color="secondary">Alterar</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
            <Button
                onClick={openModal}
                variant="contained"
                color="secondary"
                style={{ marginTop: '20px' }}>
                Adicionar
            </Button>
            <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth="sm">
                <DialogTitle id="form-dialog-title">Novo Livro</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Qual é o seu livro novo?
                </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="autor"
                        label="Nome do Autor"
                        autoComplete="off"
                        type="text"
                        fullWidth
                        value={autor}
                        onChange={e => setAutor(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="titulo"
                        label="Título"
                        autoComplete="off"
                        type="text"
                        fullWidth
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}

                    />
                    <TextField
                        margin="dense"
                        id="anoPublic"
                        label="Ano de Publicação"
                        autoComplete="off"
                        type="year"
                        fullWidth
                        value={anopublic}
                        onChange={e => setAnopbublic(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="secondary">
                        Cancelar
                </Button>
                    <Button color="secondary" onClick={addLivro}>
                        Salvar
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open1} onClose={closeModal1} fullWidth={true} maxWidth="sm">
                <DialogTitle id="form-dialog-title">Alterar Livro</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        O que deseja alterar?
                </DialogContentText>
                <TextField
                        autoFocus
                        margin="dense"
                        id="id"
                        label="Código"
                        autoComplete="off"
                        type="number"
                        fullWidth
                        value={id}
                        onChange={e => setId(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="autor"
                        label="Nome do Autor"
                        autoComplete="off"
                        type="text"
                        fullWidth
                        value={autor}
                        onChange={e => setAutor(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="titulo"
                        label="Título"
                        autoComplete="off"
                        type="text"
                        fullWidth
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}

                    />
                    <TextField
                        margin="dense"
                        id="anoPublic"
                        label="Ano de Publicação"
                        autoComplete="off"
                        type="year"
                        fullWidth
                        value={anopublic}
                        onChange={e => setAnopbublic(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal1} color="secondary">
                        Cancelar
                </Button>
                    <Button color="secondary" onClick={alterarLivro}>
                        Salvar
                </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default App;
