:- use_module(library(system)).
:- use_module(library(random)).

getInt(Input):-
                get_code(Tinput),
                Input is Tinput - 48.

getChar(Input):-get_char(Input),
                get_char(_).

getCode(Input):- get_code(TempInput),
                 %get_code(_),
              	 Input is TempInput.

clearInput :- get_code(H),
              (
                H =\= 10 -> clearInput;
                true
              ).

inputCoords(Row,Col):-  %read row
                        getCode(RRow),

                        %read Col

                        getInt(RCol),

                        Row is RRow - 65,
                        Col is RCol - 1. % A = 41.

getNewTileCoord(Col,Row):-
    write('Insert coordinates to place tile (Col, Row): '),
    inputCoords(Col,Row),
    clearInput,
    Row < 6, Col < 6, Row > -1, Col > -1.

getNumTile(Num):-
    nl, write('Select tile to place (0, 1, 2): '),
    getInt(Num),
    clearInput,
    Num >= 0, Num < 3.


assignDirection2(108, l).
assignDirection2(114, r).

assignDirection1(117, u).
assignDirection1(100, d).
assignDirection1(108, l).
assignDirection1(114, r).

assignDirection3(117, u).
assignDirection3(100, d).
assignDirection3(108, l).
assignDirection3(114, r).

getTileDirection(t2, Direction):-   write('Insert the desired tile direction (l or r): '),
                                    getCode(C),clearInput,assignDirection2(C, Direction).
getTileDirection(t1, Direction):-   write('Insert the desired tile direction (l, u, r, d): '),
                                    getCode(C),clearInput,assignDirection1(C, Direction).
getTileDirection(t3, Direction):-   write('Insert the desired tile direction (l, u, r, d): '),
                                    getCode(C),clearInput, assignDirection3(C, Direction).

getTileDirection(t4, _).
getTileDirection(t8, _).

displayPlayerHand(L1,Pname):-  %draw all pieces in player hand
                          write('Player '),
                          write(Pname),
                          write(' hand: '),
                          nl,
                          write('  -------------------'),
                          nl,
                          write('  |'),
                          display_line_p1(L1),
                          write('  |'),
                          display_line_p2(L1),
                          write('  |'),
                          display_line_p3(L1),
                          write('  -------------------').


optionSelect(Min,Max, Value):- write('Insert an option: '),
                            getInt(H),
                            clearInput,
                            nl,
                            Min =< H,
                            H =< Max,
                            Value is H.

showStarterPlayer(Player):- write('Player '), write(Player), write(' starts').

showPlace2STiles(Player):- write('Player '), write(Player), write(' place 2 starting tiles. ').

showPlace1STiles(Player):- write('Player '), write(Player), write(' place 1 starting tile. ').

displayStart:- write('----------------------------'), nl,
               write('||       || ILIOS ||      ||'), nl,
               write('||                        ||'), nl,
               write('----------------------------').

displayMenu:- write('----------------------------'), nl,
              write('| |          Menu         | |'), nl,
              write('| |  1 Player Vs Player   | |'), nl,
              write('| |  2 Player Vs Bot      | |'), nl,
              write('| |                       | |'), nl,
              write('| |                       | |'), nl,
              write('----------------------------').

displayBotLevel:-write('----------------------------'), nl,
                 write('| |       Bot Level      | |'), nl,
                 write('| |        Level 1       | |'), nl,
                 write('| |                      | |'), nl,
                 write('----------------------------').


selectBot:- nl,
            displayBotLevel,
            nl.
confGame(GameType):- displayStart,
                               nl,
                               displayMenu,
                               nl,
                               repeat,
                               write('----------------------------'),
                               nl,
                               optionSelect(1,2,GameType),
                               write('----------------------------'),
                               nl.



playerhand([tile(a,t2,l),     tile(a,t2,l), tile(a,t2,r)]).


showScore(P1, P2, P1Score, P2Score):- write('Player '), write(P1), write(' score:'), write(P1Score), nl,
                                      write('Player '), write(P2), write(' score:'), write(P2Score).
showWinner(P1, _, P1Score, P2Score):- P1Score > P2Score,
                                       write('Player '), write(P1), write(' is the winner. Congratulations!').

showWinner(_, P2, P1Score, P2Score):- P2Score > P1Score,
                                       write('Player '), write(P2), write(' is the winner. Congratulations!').

showWinner(_, _, _, _):- write('It\'s a tie! Good game!').
