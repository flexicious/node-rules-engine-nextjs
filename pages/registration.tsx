import { Box, Button, Card, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Formik, FormikValues } from "formik";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Registration = () => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    session && router.push("/");
  }, [session, router]);
  const [error, setError] = useState(false);
  const handleRegistration = (values: FormikValues) => {
    axios
      .post("/api/registration", values)
      .then(() => {
        setError(false);
        alert("Registration was successful!");
        router.back();
      })
      .catch((error) => {
        alert("Something went wrong! Try again later.");
        setError(true);
      });
  };
  return (
    <>
      <div >
        <Head>
          <title>Registration</title>
          <meta name="description" content="Registration for the store" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Card sx={{ p: 4 }}>
            <Formik
              initialValues={{ email: "", username: "", password: "", birthdate: "", gender: "" }}
              onSubmit={(values) => handleRegistration(values)}
            >
              {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Stack gap={2}>
                    <Typography component="h1" variant="h4">
                      Register for the E-commerce store
                    </Typography>
                    <TextField
                      onChange={handleChange}
                      value={values.email}
                      error={error}
                      type="email"
                      name="email"
                      placeholder="Email"
                    />
                    {errors.email && (
                      <Typography sx={{ p: 0, fontSize: ".8em" }}>
                        {errors.email}
                      </Typography>
                    )}
                    <TextField
                      onChange={handleChange}
                      value={values.username}
                      error={error}
                      type="text"
                      name="username"
                      placeholder="Username"
                    />
                    {errors.username && (
                      <Typography sx={{ p: 0, fontSize: ".8em" }}>
                        {errors.username}
                      </Typography>
                    )}
                    <TextField
                      onChange={handleChange}
                      value={values.password}
                      error={error}
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    {errors.password && (
                      <Typography sx={{ p: 0, fontSize: ".8em" }}>
                        {errors.password}
                      </Typography>
                    )}
                    <TextField placeholder="MM-DD-YYYY" type="date" error={error} name="birthdate" onChange={handleChange}
                    />
                    {errors.birthdate && (
                      <Typography sx={{ p: 0, fontSize: ".8em" }}>
                        {errors.birthdate}
                      </Typography>
                    )}
                    <Select placeholder="Gender" error={error} name="gender" defaultValue={""} onChange={handleChange}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                    {
                      errors.gender && (
                        <Typography sx={{ p: 0, fontSize: ".8em" }}>
                          {errors.gender}
                        </Typography>
                      )}
                    <Button variant="contained" type="submit">Register</Button>
                    <Link href="/api/auth/signin?csrf=true">
                      <Button variant="contained">Sign in</Button>
                    </Link>
                  </Stack>
                </form>
              )}
            </Formik>
          </Card>
        </Box>
      </div>
    </>
  );
};

export default Registration;
