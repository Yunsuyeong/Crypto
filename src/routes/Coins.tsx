import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { isDarkAtom } from "../atoms";

interface ICoinsProps {}

const Container = styled.div`
    padding: 0px 40px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
    background-color: lightblue;
    color: ${(props) => props.theme.textColor};
    font-weight: bold;
    padding: 10px;
    border-radius: 20px;
    margin-bottom: 20px;
    a {
        display: flex;
        align-items: center;
        padding: 10px;
        transition: color 0.1s ease-in;
    }
    &:hover {
        color: ${(props) => props.theme.accentColor};
    }
`;

const Title = styled.h1`
    font-size: 36px;
    color: ${(props) => props.theme.accentColor};
`;

const ToggleBtn = styled.button`
    display: inline-block;
    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
        7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 10px;
    padding: 2px 10px;
    margin-top: 5px;
    color: white;
    background-color: #1fd1f9;
    background-image: linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%);
    transition: all 0.3s ease;
    border: none;
    z-index: 1;
    &:hover {
        background-image: linear-gradient(315deg, #1fd1f9 74%, #b621fe 0%);
        box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.5),
            -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
            inset -4px -4px 6px 0 rgba(255, 255, 255, 0.5),
            inset 4px 4px 6px 0 rgba(116, 125, 136, 0.3);
        transition: all 0.3s ease;
        color: #fff;
    }
`;

const Loader = styled.span`
    font-size: 48px;
    display: block;
    text-align: center;
`;

const Img = styled.img`
    width: 25px;
    height: 25px;
    margin-right: 5px;
`;

interface ICoin {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
}

function Coins() {
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
    const { isLoading, data } = useQuery<ICoin[]>("allcoins", fetchCoins);
    /* const [loading, setLoading] = useState(true);
    const [coins, setCoins] = useState<CoinInterface[]>([]);
    useEffect(() => {
        (async () => {
            const response = await fetch(
                "https://api.coinpaprika.com/v1/coins"
            );
            const json = await response.json();
            setCoins(json.slice(0, 100));
            setLoading(false);
        })();
    }, []); */
    return (
        <Container>
            <HelmetProvider>
                <Helmet>
                    <title>Coins</title>
                </Helmet>
            </HelmetProvider>
            <Header>
                <Title>Coins</Title>
                <ToggleBtn onClick={toggleDarkAtom}>Toggle</ToggleBtn>
            </Header>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <CoinsList>
                    {data?.slice(0, 100).map((coin) => (
                        <Coin key={coin.id}>
                            <Link
                                to={{
                                    pathname: `/${coin.id}`,
                                    state: { name: coin.name },
                                }}
                            >
                                <Img
                                    src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                                ></Img>
                                {coin.name} ({coin.symbol})
                            </Link>
                        </Coin>
                    ))}
                </CoinsList>
            )}
        </Container>
    );
}

export default Coins;
