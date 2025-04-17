import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    hideVirtualKeyboard = () => {
        const inputElements = document.getElementsByTagName('input');
        Array.from(inputElements).forEach((input) => {
            input.blur();
        });
    };

    render() {
        return (
            <Html>
                <Head>
                    <link rel="manifest" href="/manifest.json" />
                    <meta name="theme-color" content="#6366F1" />
                    <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
                    <link rel="apple-touch-icon" href="/images/layout/icon-192x192.jpg" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
