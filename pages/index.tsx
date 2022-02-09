import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';
import { useState } from 'react';
import {
  AppBar,
  Backdrop,
  Grid,
  Icon,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const transactionTypes = [
  { description: 'Débito', isIncoming: true },
  { description: 'Boleto', isIncoming: false },
  { description: 'Financiamento', isIncoming: false },
  { description: 'Crédito', isIncoming: true },
  { description: 'Recebimento Empréstimo', isIncoming: true },
  { description: 'Vendas', isIncoming: true },
  { description: 'Recebimento TED', isIncoming: true },
  { description: 'Recebimento DOC', isIncoming: true },
  { description: 'Aluguel', isIncoming: false },
];

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  margin: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

export default function Home() {
  const router = useRouter();

  const [session, loading] = useSession();

  const [addingTransactions, setAddingtransactions] = useState([]);

  const [sendingTransactions, setSendingTransactions] = useState(false);

  const [transactions, setTransactions] = useState<any[]>(null);

  const [totalIncoming, setTotalIncoming] = useState(0);

  const [totalOutgoing, setTotalOutgoing] = useState(0);

  const { acceptedFiles, getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: '.txt',
    multiple: false,
  });

  const parseLine = (line: string) => {
    const transaction = {
      transactionType: +line?.substring(0, 1),
      referenceDate: dayjs(line?.substring(1, 9) + line?.substring(42, 48), 'YYYYMMDDHHmmss'),
      value: parseInt(line?.substring(9, 19)) / 100,
      document: line?.substring(19, 30),
      cardNumber: line?.substring(30, 42),
      storeOwner: line?.substring(48, 62),
      storeName: line?.substring(62, 81),
    };

    return transaction;
  };

  useEffect(() => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const newAddingTransactions = [];

        (reader.result as string).split(/[\r\n]+/g).forEach(line => {
          if (!line.length) return;

          newAddingTransactions.push(parseLine(line));
        });

        setAddingtransactions(newAddingTransactions);
      };

      reader.readAsText(file);
    });
  }, [acceptedFiles]);

  useEffect(() => {
    if (!addingTransactions.length) return;

    setSendingTransactions(true);

    const addTransactionPromisses = [];

    addingTransactions.forEach(addingTransaction => {
      addTransactionPromisses.push(
        fetch('/api/transactions', {
          body: JSON.stringify(addingTransaction),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
      );
    });

    Promise.all(addTransactionPromisses).then(async () => {
      await getTransactions();

      setSendingTransactions(false);
      setAddingtransactions([]);
    });
  }, [addingTransactions]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  ) as any;

  if (!loading && !session) {
    router.replace(`/auth/login`);
  }

  const getTransactions = async () => {
    const response = await fetch(`/api/transactions`);
    const json = await response.json();
    setTransactions(json.transactions);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    if (!transactions) return;

    setTotalIncoming(getTotal(true));
    setTotalOutgoing(getTotal(false));
  }, [transactions]);

  const getTotal = isIncoming => {
    const incomingTypes = transactionTypes.filter(t => t.isIncoming === isIncoming).map((t, i) => i + 1);
    return transactions
      .filter(t => incomingTypes.includes(t.transactionType))
      .map(t => parseFloat(t.value))
      .reduce((prev, next) => prev + next);
  };

  return session && transactions ? (
    <>
      <CssBaseline />
      <AppBar position="static" color="transparent">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography>Hello, {session.user.name}!</Typography>
          <Typography>CNAB</Typography>
          <IconButton onClick={() => signOut()}>
            <Icon>logout</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Backdrop open={sendingTransactions}></Backdrop>
      <section className="container">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drop a file here, or click to browse and select one</p>
        </div>
      </section>
      <Typography variant="h5" style={{ margin: 10 }}>
        TRANSACTIONS
      </Typography>
      <Grid container spacing={2} style={{ padding: 10 }}>
        <Grid item xs={4}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">Total Incoming</Typography>
            <Typography variant="subtitle1">{totalIncoming.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">Total Outgoing</Typography>
            <Typography variant="subtitle1">{totalOutgoing.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">Balance</Typography>
            <Typography variant="subtitle1">{(totalIncoming - totalOutgoing).toFixed(2)}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Document</TableCell>
              <TableCell align="right">Card Number</TableCell>
              <TableCell align="right">Store Owner</TableCell>
              <TableCell align="right">Store Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{transactionTypes[transaction.transactionType - 1].description}</TableCell>
                <TableCell align="right">{transaction.referenceDate}</TableCell>
                <TableCell align="right">{transaction.value}</TableCell>
                <TableCell align="right">{transaction.document}</TableCell>
                <TableCell align="right">{transaction.cardNumber}</TableCell>
                <TableCell align="right">{transaction.storeOwner}</TableCell>
                <TableCell align="right">{transaction.storeName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : null;
}
