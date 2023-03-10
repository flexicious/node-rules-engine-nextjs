import { Box, Button, Card, Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Link from 'next/link'
import { Store } from '@/components/Store'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        {
          status === 'authenticated' ? (
            <Store/>
          ) : (
            <Card sx={{ p: 4 }}>
              <Stack gap={4}>
                <Typography component="h1" variant="h6">
                  Please sign in or register
                </Typography>

                <Link href="/api/auth/signin?csrf=true" legacyBehavior>
                  <Button variant='contained'> Sign in </Button>
                </Link>
                <Link href="/registration" legacyBehavior>
                  <Button variant='contained'> Register</Button>
                </Link>
              </Stack>
            </Card>
          )
        }
      </Box>

    </>
  )
}
