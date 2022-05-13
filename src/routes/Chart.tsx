import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

interface chartProps {
    coinId: string;
}

function Chart({ coinId }: chartProps) {
    const isDark = useRecoilValue(isDarkAtom);
    const { isLoading, data } = useQuery<IHistorical[]>(
        ["ohlcv", coinId],
        () => fetchCoinHistory(coinId),
        {
            refetchInterval: 3000,
        }
    );
    return (
        <div>
            {isLoading ? (
                "Loading chart..."
            ) : (
                <ApexChart
                    type="candlestick"
                    series={[
                        {
                            data: data?.map((price) => [
                                new Date(price.time_open).getTime(),
                                price.open.toFixed(4),
                                price.high.toFixed(4),
                                price.low.toFixed(4),
                                price.close.toFixed(4),
                            ]) as any,
                        },
                    ]}
                    options={{
                        theme: {
                            mode: isDark ? "dark" : "light",
                        },
                        chart: {
                            type: "candlestick",
                            height: 350,
                            width: 500,
                            toolbar: {
                                show: false,
                            },
                            background: "transparent",
                        },
                        stroke: {
                            curve: "stepline",
                            width: 2,
                        },
                        yaxis: {
                            show: false,
                        },
                        xaxis: {
                            type: "datetime",
                            categories: data?.map((price) => price.time_close),
                            labels: {
                                style: {
                                    colors: isDark ? "#ecf0f1" : "black",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                },
                            },
                            axisBorder: {
                                show: true,
                                color: isDark ? "white" : "black",
                            },
                        },
                        plotOptions: {
                            candlestick: {
                                colors: {
                                    upward: "#d63031",
                                    downward: "#0984e3",
                                },
                            },
                        },
                    }}
                />
            )}
        </div>
    );
}

export default Chart;
