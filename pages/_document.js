import {Head, Html, Main, NextScript} from 'next/document'
import {Container, Navbar} from "react-bootstrap";

export default function Document() {
    return (
        <Html lang="en">
            <Head title={process.env.APP_NAME}>
                <link rel="icon" type="image/x-icon" href='/favicon.ico'/>
            </Head>
            <body>
            <Navbar bg="light" className="py-3 shadow-sm">
                <div style={{margin: '0 30px'}}>
                    <Navbar.Brand href="#home">{process.env.APP_NAME}</Navbar.Brand>
                </div>
            </Navbar>

            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}