import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
    Route,
    Switch,
    useLocation,
    useParams,
    useRouteMatch,
} from "react-router";
import Chart from "./Chart";
import Price from "./Price";
import { useQuery } from "react-query";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

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
        background-image: linear-gradient(45deg, #1fd1f9 74%, #b621fe 0%);
        box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.5),
            -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
            inset -4px -4px 6px 0 rgba(255, 255, 255, 0.5),
            inset 4px 4px 6px 0 rgba(116, 125, 136, 0.3);
        transition: all 0.3s ease;
        color: #fff;
    }
`;

const BackBtn = styled.button`
    display: inline-block;
    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
        7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border: none;
    border-radius: 5px;
    padding: 5px 20px;
    margin-bottom: 15px;
    background-color: transparent;
    color: ${(props) => props.theme.textColor};
    transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
    &:hover {
        background-color: #c0392b;
        transition: 200ms ease-in-out;
    }
`;

const Overview = styled.div`
    display: flex;
    justify-content: space-around;
    color: black;
    background-color: lightblue;
    padding: 10px 20px;
    border-radius: 20px;
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    span:first-child {
        font-size: 15px;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 10px;
    }
    span:last-child {
        font-size: 12px;
        font-weight: 500;
    }
`;

const Description = styled.p`
    margin: 20px 10px;
    font-size: 18px;
    font-weight: 300;
    color: ${(props) => props.theme.textColor};
`;

const Tabs = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: inherit;
    margin-top: 40px;
`;

const Tab = styled.span<{ isActive: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${(props) =>
        props.isActive ? props.theme.accentColor : props.theme.textColor};
    background-color: lightblue;
    padding: 5px 80px;
    border-radius: 20px;
    font-size: 15px;
    font-weight: bold;

    a {
        display: block;
    }
`;

const Title = styled.h1`
    font-size: 24px;
    color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
    font-size: 48px;
    display: block;
    text-align: center;
`;

interface RouteState {
    state: {
        name: string;
    };
}

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    contract: string;
    platform: string;
    description: string;
    message: string;
    open_source: boolean;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}

interface PriceData {
    id: string;
    symbol: string;
    rank: string;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        };
    };
}

interface ICoinProps {}

function Coin({}: ICoinProps) {
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
    const { coinId } = useParams<{ coinId: string }>();
    const { state } = useLocation() as RouteState;
    const priceMarch = useRouteMatch("/:coinId/price");
    const chartMarch = useRouteMatch("/:coinId/chart");
    const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
        ["info", coinId],
        () => fetchCoinInfo(coinId)
    );
    const { isLoading: tickersLoading, data: tickersData } =
        useQuery<PriceData>(
            ["tickers", coinId],
            () => fetchCoinTickers(coinId),
            {
                refetchInterval: 3000,
            }
        );
    /* const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<InfoData>();
    const [priceInfo, setPriceInfo] = useState<PriceData>();

    useEffect(() => {
        (async () => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
            console.log(infoData);
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();
            console.log(priceData);
            setInfo(infoData);
            setPriceInfo(priceData);
            setLoading(false);
        })();
    }, []); */
    const loading = infoLoading || tickersLoading;
    return (
        <Container>
            <HelmetProvider>
                <Helmet>
                    <title>
                        {state?.name
                            ? state.name
                            : loading
                            ? "Loading..."
                            : infoData?.name}
                    </title>
                </Helmet>
            </HelmetProvider>
            <Header>
                <Title>
                    {state?.name
                        ? state.name
                        : loading
                        ? "Loading..."
                        : infoData?.name}
                </Title>
                <ToggleBtn onClick={toggleDarkAtom}>Toggle</ToggleBtn>
            </Header>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <BackBtn>
                        <Link to={`/`}>back</Link>
                    </BackBtn>
                    <Overview>
                        <OverviewItem>
                            <span>Rank: </span>
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Symbol: </span>
                            <span>{infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Price: </span>
                            <span>
                                {tickersData?.quotes.USD.price.toFixed(3)}
                            </span>
                        </OverviewItem>
                    </Overview>
                    <Description>{infoData?.description}</Description>
                    <Overview>
                        <OverviewItem>
                            <span>Total Supply: </span>
                            <span>{tickersData?.total_supply}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Max supply: </span>
                            <span>{tickersData?.max_supply}</span>
                        </OverviewItem>
                    </Overview>

                    <Tabs>
                        <Tab isActive={priceMarch !== null}>
                            <Link to={`/${coinId}/price`}>Price</Link>
                        </Tab>

                        <Tab isActive={chartMarch !== null}>
                            <Link to={`/${coinId}/chart`}>Chart</Link>
                        </Tab>
                    </Tabs>
                    <Switch>
                        <Route path={`/:coinId/price`}>
                            <Price coinId={coinId} />
                        </Route>
                        <Route path={`/:coinId/chart`}>
                            <Chart coinId={coinId} />
                        </Route>
                    </Switch>
                </>
            )}
        </Container>
    );
}

export default Coin;
