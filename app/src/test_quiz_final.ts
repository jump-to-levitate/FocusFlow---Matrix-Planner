// === Synthetic Logic Test for Sprint 1 ===
import { processQuiz } from './logic/processQuiz';

console.log('SPRINT 1 Logic Test: processQuiz\n');

const result1 = processQuiz({ W1: true, W2: true, P1: true, P2: true });
console.log('Test 1 - Input: {W1:true,W2:true,P1:true,P2:true}');
console.log('  Expected: quadrant=I, isComplete=false');
console.log('  Actual:   quadrant=' + result1.quadrant + ', isComplete=' + result1.isComplete);
const pass1 = result1.quadrant === 'I' && result1.isComplete === false;
console.log('  ' + (pass1 ? 'PASS' : 'FAIL'));

const result2 = processQuiz({ W1: true, W2: true, W3: true, P1: false, P2: false, P3: false });
console.log('\nTest 2 - Input: {W1:true,W2:true,W3:true,P1:false,P2:false,P3:false}');
console.log('  Expected: quadrant=II, isComplete=true');
console.log('  Actual:   quadrant=' + result2.quadrant + ', isComplete=' + result2.isComplete);
const pass2 = result2.quadrant === 'II' && result2.isComplete === true;
console.log('  ' + (pass2 ? 'PASS' : 'FAIL'));

console.log('\n' + (pass1 && pass2 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'));
if (!(pass1 && pass2)) {
  throw new Error('Tests failed');
}
