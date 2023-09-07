import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo-outline.svg";

const AboutPage = (): React.ReactElement => (
  <>
    <header className="flex items-center mt-4">
      <Link href="/" className="mr-2 px-2">
        <Image src={logo} alt="아이크" className="w-4 pb-1 mr-2 inline" />
        아이유 응원법
      </Link>
    </header>
    <section className="flex flex-col gap-4 my-4">
      <p>이 사이트는 팬사이트입니다. 아이유나 소속사와 관련이 없습니다.</p>
      <p>
        이 사이트는{" "}
        <a
          href="https://analytics.google.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Analytics
        </a>
        를 사용하여 이용 데이터를 수집합니다. 수집한 데이터는 사이트 이용 분석
        목적으로만 사용하며 광고 등의 목적으로 사용하지 않습니다.
      </p>
      <p>
        GitHub:{" "}
        <a
          href="https://github.com/jangjunha/iu-fanchants"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono"
        >
          iu-fanchants
        </a>
      </p>
    </section>
  </>
);
export default AboutPage;
