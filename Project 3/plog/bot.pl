validP(_,_, _).
makeValidP(Row,Col, Dir, validP(Row,Col,Dir)).
getRow(validP(R,_, _),R).
getCol(validP(_,C, _),C).

listValidMoves(Board,Result,Player,PlayerHand):- listValidMoves(Board,Temp,0,0,Player,Board),delete(Temp, [], S),!,crossCompability(PlayerHand,S,Result),nl.

listValidMoves([],[],_,_,_,_).
listValidMoves([L1|Ls],Result,Row,Col,Player,Board):-  listValidMovesLine(L1,R1,Row,Col,Player,Board),
                                                       Row1 is Row + 1,!,
                                                       % write('ROW '),write(Row),nl,
                                                       listValidMoves(Ls,Rs,Row1,0,Player,Board),
                                                       append(R1,Rs,Result).


listValidMovesLine([],[],_,_,_,_).
listValidMovesLine([_|Es],Result,Row,Col,Player,Board):-  Col1 is Col+1,
                                                            %write('col '),write(Col),nl,
                                                            checkIsEnemy(Board,Row,Col,Player),
                                                            listValidPos(Board,Row,Col,R1),
                                                            listValidMovesLine(Es,Rs,Row,Col1,Player,Board),
                                                            append(R1,Rs,Result).

listValidMovesLine([_|Es],Result,Row,Col,Player,Board):-  Col1 is Col+1,
                                                           listValidMovesLine(Es,Result,Row,Col1,Player,Board).

checkIsEnemy(Board,Row,Col,Player):-  getTileBoard(Board,Row,Col,Tile),
                                      assertEnemy(Tile,Player).


listValidPos(Board,Row,Col,Result):-  Up is Row -1,
                                             Down is Row + 1,
                                             Left is Col -1,
                                             Rigth is Col +1,
                                             getValidPos(Board,Up,Col,R1,d),
                                             getValidPos(Board,Up,Left,R2,dr),
                                             getValidPos(Board,Up,Rigth,R3,dl),

                                             getValidPos(Board,Row,Left,R4,r),
                                             getValidPos(Board,Row,Rigth,R5,dl),

                                             getValidPos(Board,Down,Left,R6,dl),
                                             getValidPos(Board,Down,Col,R7,dl),
                                             getValidPos(Board,Down,Rigth,R8,dl),

                                             append([R1],[R2], T1),
                                             append([R3],[R4], T2),
                                             append([R5],[R6], T3),
                                             append([R7],[R8], T4),

                                             append(T1,T2,F1),
                                             append(T3,T4,F2),

                                             append(F1,F2,Result).

getValidPos(Board,Row,Col,Result,Dir):-  Row < 6, Col < 6,
                                         Row > -1, Col > -1,
                                         emptyPlace(Board,Row, Col),
                                         makeValidP(Row,Col,Dir,Result).
getValidPos(_,_,_,[],_).

assertEnemy(E1,Player):- getPlayer(E1,P), P \== e, P \= Player,getTile(E1,T),\+ integer(T).


comp(validP(_,_,u),t1).
comp(validP(_,_,u),t3).
comp(validP(_,_,u),t8).

comp(validP(_,_,d),t1).
comp(validP(_,_,d),t3).
comp(validP(_,_,d),t8).

comp(validP(_,_,r),t1).
comp(validP(_,_,r),t3).
comp(validP(_,_,r),t8).

comp(validP(_,_,l),t1).
comp(validP(_,_,l),t3).
comp(validP(_,_,l),t8).

comp(validP(_,_,dl),t2).
comp(validP(_,_,dl),t4).
comp(validP(_,_,dl),t8).

comp(validP(_,_,dr),t2).
comp(validP(_,_,dr),t4).
comp(validP(_,_,dr),t8).

comp(validP(_,_,ur),t2).
comp(validP(_,_,ur),t4).
comp(validP(_,_,ur),t8).

comp(validP(_,_,ul),t2).
comp(validP(_,_,ul),t4).
comp(validP(_,_,ul),t8).

playable(_,_,_).
makeplayable(Row,Col,Tile,playable(Row,Col,Tile)).

getRowPlayable(playable(R,_,_),R).
getColPlayable(playable(_,C,_),C).
getTilePlayable(playable(_,_,T),T).

cross([],_,[]).
cross([P1|Ps],Option,[R|Rs]):-       getTile(P1,T),
                                     comp(Option,T),
                                     getRow(Option,Row),
                                     getCol(Option,Col),
                                     makeplayable(Row,Col,T,R),
                                     cross(Ps,Option,Rs).

cross([_|Ps],Option,Result):- cross(Ps,Option,Result).

crossCompability(_,[],[]).
crossCompability(PlayerHand,[O1|Os], Result):-  cross(PlayerHand,O1,R1),
                                                crossCompability(PlayerHand,Os,Rs),!,
                                                append(R1,Rs,Result).
crossCompability(PlayerHand,[_|Os], Result):- !,crossCompability(PlayerHand,Os,Result).

xXx([[],[],validP(0,4,dl),[],validP(1,4,dl),[],[],validP(2,4,dl),validP(1,5,d),validP(1,4,dr),[],validP(2,4,r),[],validP(3,4,dl),validP(3,5,dl),[]]).
tvalid:-testboard(X),playerhand(PlayerHand),listValidMoves(X,R,'B',PlayerHand),displayBoard(X),nl,write(R),nl,playerhand(PlayerHand),crossCompability(PlayerHand,R, Result), nl, write(Result).
trem:- xXx(X), clearOutput(X,R), nl, write(R),nl.

%playINempty(Board,NewBoard,Player,Tile).

findEmpty([],_,_,_,_).
findEmpty([L1|_],Row,_,RR,CC):-  findEmptyLine(L1,Row,0,RR,CC).


findEmpty([_|Ls],Row,Col,RR,CC):- Row1 is Row+1,
                                  findEmpty(Ls,Row1,Col,RR,CC).

findEmptyLine([E1|_],Row,Col,RR,CC):- checkEmpty(E1),
                                       RR is Row,
                                       CC is Col.

findEmptyLine([_|Es],Row,Col,RR,CC):-  Col1 is Col + 1 ,
                                      findEmptyLine(Es,Row,Col1,RR,CC).

playINempty(Board,NewBoard,Tile) :- findEmpty(Board,0,0,Row,Col),
                                           placeTile(Board,Tile,Row,Col,NewBoard).

playInValidPlace(Board, NewBoard, Option,Player,PlayerHand,NPlayerHand):-
                                                                getRowPlayable(Option, Row),
                                                                getColPlayable(Option, Col),
                                                                getTilePlayable(Option, Tile),
                                                              playTile(Board,NewBoard,Player,Tile,Row,Col),
                                                              removeTilePlayerHand(_,PlayerHand,NPlayerHand,0).



playTile(Board,NewBoard,Player,Tile,Row,Col):- (Tile == t1;Tile == t3), validPlacement(Board, tile(Player,Tile,u), Row, Col),

                                               attack(Board, tile(Player,Tile,u), Row, Col, NewBoard).

playTile(Board,NewBoard,Player,Tile,Row,Col):- (Tile == t1;Tile == t3), validPlacement(Board, tile(Player,Tile,d), Row, Col),
                                               attack(Board, tile(Player,Tile,d), Row, Col, NewBoard).

playTile(Board,NewBoard,Player,Tile,Row,Col):- (Tile == t1;Tile == t3), validPlacement(Board, tile(Player,Tile,l), Row, Col),
                                               attack(Board, tile(Player,Tile,l), Row, Col, NewBoard).

playTile(Board,NewBoard,Player,Tile,Row,Col):- (Tile == t1;Tile == t3), validPlacement(Board, tile(Player,Tile,r), Row, Col),
                                               attack(Board, tile(Player,Tile,r), Row, Col, NewBoard).


playTile(Board,NewBoard,Player,t2,Row,Col):- validPlacement(Board, tile(Player,t2,l), Row, Col),
                                             attack(Board, tile(Player,t2,l), Row, Col, NewBoard).

playTile(Board,NewBoard,Player,t2,Row,Col):- validPlacement(Board, tile(Player,t2,r), Row, Col),
                                             attack(Board, tile(Player,t2,r), Row, Col, NewBoard).


playTile(Board,NewBoard,Player,Tile,Row,Col):- attack(Board, tile(Player,Tile,u), Row, Col, NewBoard).

botLevel1Turn(Board,NewBoard,Player,PlayerHand,NPlayerHand,TilePool,PoolSize,NewTilePool):-
        listValidMoves(Board,[R1|Rs],Player,PlayerHand),!,

        (
        (

          [R1|Rs] == [],

          removeTilePlayerHand(Tile,PlayerHand,Hand,0),
          playINempty(Board,Board1,Tile)
        )
        ;
        (

          playInValidPlace(Board, Board1, R1,Player,PlayerHand,Hand)

        )
        ),
        addTilePlayerHand(TilePool, PoolSize, NewTilePool, Player, Hand, NPlayerHand),
        surroundedTiles(Board1,NewBoard,0,Board1).

%tf:- testboard(X),displayBoard(X),findEmpty(X,0,0,RR,CC),nl, write('RESULTADO'),nl, write(RR), nl, write(CC), nl.


/*


getBestMove(Board, [], BestMove, BestScore).
getBestMove(Board, [validP(Line, Col, Dir)|MovesT], Player, BestMove, BestScore, NewBestMove, NewBestScore):- attack(Board, tile(...), Line, Col, TempBoard),
                                                                                   surroundedTiles(TempBoard, NewBoard, 0, TempBoard),
                                                                                   totalPoints(NewBoard, ScoreA, ScoreB),
                                                                                   (
                                                                                    (
                                                                                    Player == 'A',
                                                                                    ScoreA >= BestScore,
                                                                                    NewBestScore is ScoreA,
                                                                                    NewBestMove is ...
                                                                                    );
                                                                                    (
                                                                                    Player == 'B',
                                                                                    ScoreB > BestScore,
                                                                                    NewBestScore is ScoreB,
                                                                                    NewBestMove is ...
                                                                                    )
                                                                                    getBestMove(Board, MovesT, Player, NewBestMove, NewBestScore, NNBestMove, NNBestScore)
                                                                                   )
                                                                                   getBestMove(Board, MovesT, Player, BestMove, BestScore)
*/
