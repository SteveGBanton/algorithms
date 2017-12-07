// Sample data
const firstSample = 'GTCGTTCGGAATGCCGTTGCTCTGTAAA';
const secondSample = 'ACCGGTCGAGTGCGCGGAAGCCGGCCGAA';
// Solution LCS: 'GTCGTCGGAAGCCGGCCGAA';

// Run algorithm & output to console.
console.log(compare(firstSample, secondSample));

/*
  Fast version of an algorithm to compare DNA strands using a 2D array.
  Uses a Longest Common Substring method which generates a thrid string to compare the samples.
  Can compare very long lengths quickly.

  Returns a promise which is resolved when computation is complete.
  First returns two tables which provide length of LCS
 */
function compare(firstSequence, secondSequence) {

  const arrayA = firstSequence.split('');
  const arrayB = secondSequence.split('');
  
  /*
    Takes DNA strings A and B as arguments
    
    Outputs two tables, bTable and cTable
    bTable has already calculated LCS string length, cTable provides a 'map' to contruct the residues.

   */
  function dynamicLCS(A, B) {
    const m = A.length;
    const n = B.length;

    const bTable = new Array(m);
    const cTable = new Array(m);

    for (let i = 0; i <= m; i += 1) {
      if (i !== m) {
        bTable[i + 1] = [];
      }
      cTable[i] = [];
    }
    
    for (let i = 0; i <= m; i += 1) {
      cTable[i][0] = 0;
    }

    for (let i = 1; i <= n; i += 1) {
      cTable[0][i] = 0;
    }

    for (let i = 1; i <= m; i += 1) {
      for (let j = 1; j <= n; j += 1) {
        if (A[i - 1] === B[j - 1]) {
          cTable[i][j] = cTable[i - 1][j - 1] + 1;
          bTable[i][j] = 2;
        } else if (cTable[i - 1][j] >= cTable[i][j - 1]) {
          cTable[i][j] = cTable[i - 1][j];
          bTable[i][j] = 3;
        } else {
          cTable[i][j] = cTable[i][j-1];
          bTable[i][j] = 1;
        }
      }
    }

    return {
      bTable,
      cTable,
    };
  }

  /*
    Uses tables and strings to create the residues and show comparison between 

    Outputs Arrays:
    Sequence A with '*' symbols to match LCS with original
    Sequence B with '*' symbols to match LCS with original
    Sequence of the LCS
  
   */
  function getSequence(bTable, cTable, A, B) {
    const sequenceA = [];
    const sequenceB = [];
    const sequenceAlone = [];
    let nCounter = B.length;
    let mCounter = A.length;

    let longest = Math.max(nCounter, mCounter);

    while (nCounter > 0 && mCounter > 0) {
      if (bTable[mCounter][nCounter] === 2) {
        mCounter -= 1;
        nCounter -= 1;
        const char = A[mCounter];
        sequenceA.unshift(char);
        sequenceB.unshift(char);
        sequenceAlone.unshift(char);
      } else if (bTable[mCounter][nCounter] === 3) {
        mCounter -= 1;
        sequenceA.unshift('*');
      } else {
        nCounter -= 1;
        sequenceB.unshift('*');
      }
    }

    while (sequenceA.length < A.length) {
      sequenceA.unshift('*');
    }
    while (sequenceB.length < B.length) {
      sequenceB.unshift('*');
    }

    return { 
      sequenceA,
      sequenceB,
      sequenceAlone,
    }
  }

  return new Promise((resolve) => {
    const {
      bTable,
      cTable
    } = dynamicLCS(firstSequence, secondSequence);
    const result = getSequence(bTable, cTable, firstSequence, secondSequence);
    resolve(result);
  });
}

/*
  Slow recursive version of an algorithm to compare DNA strands.
  Runs in 2^n time! Cannot handle strands more than ~20 characters long.

  Returns a promise which is resolved when computation is complete.
  Value returned is number 

 */
function compareSlow(firstSequence, secondSequence) {
  function recursiveLGS(A, B) {
    if (A.length < 1 || B.length < 1) {
      return 0;
    }
    const lastA = A[A.length - 1];
    const lastB = B[B.length - 1];
    const Aless1 = A.slice(0, -1);
    const Bless1 = B.slice(0, -1);
    if (lastB === lastA) {
      return recursiveLGS(Aless1, Bless1) + 1;
    }
    return Math.max(recursiveLGS([...A], [...Bless1]), recursiveLGS([...Aless1], [...B]));
  }

  return new Promise((resolve) => {
    const result = recursiveLGS(firstSequence, secondSequence);
    resolve(result);
  });
}

