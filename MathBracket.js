import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";

const MathBracket = () => {
  const [bracket, setBracket] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    fetch("/math_challenges.xlsx")
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        const challenges = jsonData.map(row => row["Comparison Challenge"]);
        const challengeAnswers = jsonData.map(row => row["Answer"]);
        
        setBracket(challenges);
        setAnswers(challengeAnswers);
        setWinners(Array(challenges.length / 2).fill(null));
      });
  }, []);

  const handleSelect = (roundIndex, winner) => {
    const updatedWinners = [...winners];
    updatedWinners[roundIndex] = winner;
    setWinners(updatedWinners);
    
    if (updatedWinners.filter(Boolean).length === bracket.length / 2) {
      setBracket(updatedWinners);
      setWinners(Array(updatedWinners.length / 2).fill(null));
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">March Madness Math Bracket</h1>
      <div className="grid grid-cols-2 gap-4">
        {bracket.map((match, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-80 text-center shadow-lg">
              <CardContent>
                <p className="text-lg font-semibold">{match}</p>
                <Button
                  className="mt-4"
                  onClick={() => handleSelect(index, answers[index])}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Show Answer
                </Button>
                {winners[index] && (
                  <motion.p 
                    className="mt-2 text-green-600 font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Winner: {winners[index]}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MathBracket;
