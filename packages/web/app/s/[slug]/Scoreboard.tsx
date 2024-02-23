"use client";

import {
  collection,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  Timestamp,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import { auth, db } from "@/utils/firebase";
import classNames from "classnames";

const Row = ({
  doc,
  editable,
}: {
  doc: QueryDocumentSnapshot<DocumentData, DocumentData>;
  editable: boolean;
}): React.ReactElement => {
  const data = doc.data();

  const [name, setName] = useState(data.name);

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.key !== "Enter") {
      return;
    }
    await updateDoc(doc.ref, { name });
  };

  return (
    <li
      key={doc.id}
      className={classNames(
        "pl-2 pr-4 py-1 flex justify-between items-center bg-white text-black rounded-md shadow shadow-neutral-600",
        editable && "bg-yellow-200"
      )}
    >
      <input
        type="text"
        maxLength={5}
        value={name}
        onChange={(e): void => setName(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        className={classNames(
          "px-2 py-1 w-32",
          editable && "bg-transparent border-violet-500 border-b-2"
        )}
        readOnly={!editable}
      />
      <p>{doc.data().score}</p>
    </li>
  );
};

const Scoreboard = ({
  slug,
  time,
  scoreID,
}: {
  slug: string;
  time?: DateTime<true>;
  scoreID?: string;
}): React.ReactElement => {
  const date = (time ?? DateTime.now()).setZone("Asia/Seoul").startOf("day");

  const [topScores, setTopScores] =
    useState<QuerySnapshot<DocumentData, DocumentData>>();

  useEffect(() => {
    const load = async () => {
      const querySnapshot = await getDocs(
        query(
          collection(db, "songs", slug, "scores"),
          where("date", "==", Timestamp.fromMillis(date.toMillis())),
          orderBy("date", "asc"),
          orderBy("score", "desc"),
          orderBy("createdAt", "asc"),
          limit(3)
        )
      );
      setTopScores(querySnapshot);
    };
    load();
  }, [slug, time]);

  if (topScores == null) {
    return <></>;
  }
  return (
    <section>
      <h3 className="font-bold">👑 이번 주 Top 3</h3>
      {topScores.docs.length === 0 && (
        <p className="my-4 text-center">아직 기록이 없습니다</p>
      )}
      <ul role="list" className="mt-2 space-y-2">
        {topScores.docs.map((doc) => (
          <Row key={doc.id} doc={doc} editable={doc.id === scoreID} />
        ))}
      </ul>
    </section>
  );
};
export default Scoreboard;
