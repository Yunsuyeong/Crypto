import { useQuery } from "react-query";
import { fetchCoinPrice } from "../api";
import styled from "styled-components";

const View = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 100px;
    color: ${(props) => props.theme.textColor};
    margin-top: 30px;
`;

const ViewItem = styled.div`
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
`;

interface IPrice {
    name: string;
    total_supply: number;
    max_supply: number;
    quotes: {
        USD: {
            price: number;
            ath_price: number;
            percent_from_price_ath: number;
        };
    };
}

interface priceProps {
    coinId: string;
}

function Price({ coinId }: priceProps) {
    const { isLoading: PriceLoading, data: PriceData } = useQuery<IPrice>(
        ["pric", coinId],
        () => fetchCoinPrice(coinId),
        {
            refetchInterval: 3000,
        }
    );
    return (
        <div>
            {PriceLoading ? (
                "Loading price..."
            ) : (
                <View>
                    <ViewItem>
                        <span>Current: </span>
                        <span> ${PriceData?.quotes.USD.price?.toFixed(4)}</span>
                    </ViewItem>
                    <ViewItem>
                        <span>Total_sup: </span>
                        <span>{PriceData?.total_supply}</span>
                    </ViewItem>
                    <ViewItem>
                        <span>Top: </span>
                        <span>
                            ${PriceData?.quotes.USD.ath_price?.toFixed(4)}
                        </span>
                    </ViewItem>
                    <ViewItem>
                        <span>Max_sup: </span>
                        <span>{PriceData?.max_supply}</span>
                    </ViewItem>
                    <ViewItem>
                        <span>Diff: </span>
                        <span>
                            {PriceData?.quotes.USD.percent_from_price_ath}%
                        </span>
                    </ViewItem>
                </View>
            )}
        </div>
    );
}

export default Price;
