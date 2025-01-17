import { FC, useState, useEffect } from "react";
import useSWR from "swr";
import { EyeOffIcon } from "@heroicons/react/outline";

import { fetcher } from "utils/fetcher";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SelectBurnButton } from '../../utils/SelectBurnButton';

type Props = {
  details: any;
  onSelect: (id: string) => void;
  onTokenDetailsFetched?: (props: any) => unknown;
  toBurn: any;
};

export const NftCard: FC<Props> = ({
  details,
  onSelect,
  onTokenDetailsFetched = () => { },
  toBurn
}) => {
  const [fallbackImage, setFallbackImage] = useState(false);
  const { name, uri } = details?.data ?? {};

  const { data, error } = useSWR(
    // uri || url ? getMetaUrl(details) : null,
    uri,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  // console.log("data", data);



  useEffect(() => {
    if (!error && !!data) {
      onTokenDetailsFetched(data);
    }
  }, [data, error]);

  const onImageError = () => setFallbackImage(true);
  const { image } = data ?? {};

  const tokenMintAddress = details.mint;

  const wallet = useWallet();

  const { connection } = useConnection();

  const { publicKey } = useWallet();

  const creators = details.data.creators;

  let firstCreator;

  if (creators != undefined) {
    firstCreator = details.data.creators[0].address;
  }
  else {
    firstCreator = tokenMintAddress;
  }


  return (
    <div className={`card bordered max-w-xs compact rounded-md`}>
      <figure className="min-h-16 animation-pulse-color">
        {!fallbackImage || !error ? (
          <img
            src={image}
            onError={onImageError}
            className="bg-gray-900 object-cover h-30 lg:h-60"
          />
        ) : (
          // Fallback when preview isn't available
          // This could be broken image, video, or audio
          <div className="w-auto flex items-center justify-center bg-gray-900">
            <EyeOffIcon className="h-16 w-16 text-white-500" />
          </div>
        )}
      </figure>
      <div className="card-body h-28 sm:h-24">
        <h2 className="card-title text-sm pt-4 text-center">{name}</h2>
      </div>
      <div className="sm:flex justify-center">

        <SelectBurnButton tokenMintAddress={tokenMintAddress} connection={connection} publicKey={publicKey} toBurn={toBurn} />
        <a target="_blank" className="btn bg-[#55268e] hover:bg-[#3d1b66] uppercase mb-2 sm:mb-4 sm:mr-1" href={"https://solscan.io/token/" + tokenMintAddress}>Solscan</a>
      </div>
    </div>
  );
};
