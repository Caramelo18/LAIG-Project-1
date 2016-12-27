% :-initialization main.
:-include('board.pl').
:-include('interface.pl').
:-dynamic(playerList/1).
:-include('bot.pl').
:-use_module(library(lists)).
changeOwner(tile(_,T,D),P,tile(P,T,D)).
changeValue(tile(P,_,D),T,tile(P,T,D)).

changeOwnerLine([E1|Es],0,NewOwner,[H|Es]):- changeOwner(E1,NewOwner,H).
changeOwnerLine([E1|Es],Index,NewOwner,[E1|Result]):-Index>0,
                                                    I1 is Index-1,
                                                    changeOwnerLine(Es,I1,NewOwner,Result).

changeOwnerBoard([L1|Ls],0,Col,NewOwner,[H|Ls]):- changeOwnerLine(L1,Col,NewOwner,H).
changeOwnerBoard([L1|Ls],Line,Col,NewOwner,[L1|Result]):- Line > 0,
                                                           Line1 is Line - 1,
                                                           changeOwnerBoard(Ls,Line1,Col,NewOwner,Result).

placeTilePlace(tile(_,_,_), tile(P, T, D), tile(P, T, D)).

placeTileLine([L1|Ls], tile(P, T, D), 0, [H|Ls]):- placeTilePlace(L1, tile(P, T, D), H).
placeTileLine([L1|Ls], tile(P, T, D), Index, [L1|Os]):- Index > 0,
                                                        I1 is Index - 1,
                                                        placeTileLine(Ls, tile(P, T, D), I1, Os).

placeTile([L1|Ls], tile(P, T, D), 0, Col, [H|Ls]):- placeTileLine(L1, tile(P, T, D), Col, H).
placeTile([L1|Ls], tile(P, T, D), Line, Col, [L1|Os]):- Line > 0,
                                                        Line1 is Line - 1,
                                                        placeTile(Ls, tile(P, T, D), Line1, Col, Os).


getRandom(X,Max):- random(0,Max,X).

updatePool(Pool, Pool).

getRandomTile(0, [Pool|PoolS], Pool, PoolS).
getRandomTile(Num, [Pool|PoolS],Tile,[Pool|R]):- Num > 0,
                                        Num1 is Num - 1,
                                        getRandomTile(Num1, PoolS, Tile, R).
getRandomTile(Tile,Pool, R, Size):- getRandom(LineNum, Size), getRandomTile(LineNum , Pool, Tile,R).


assignTile(Tile, Tile).
createTile(Tile, Player, Type):- assignTile(tile(Player, Type, l), Tile).

getPlayerStartHand(Player, [Hand], 0, Pool, NewPool, PoolSize):- NewPoolSize is PoolSize - 3, getRandomTile(Type,Pool, NewPool, NewPoolSize),
                                                                 createTile(Hand, Player, Type).
getPlayerStartHand(Player, [Hand|Hands], Num, Pool, NewPool, PoolSize):- Num > 0,
                                                Size is PoolSize - 3 + Num,
                                                getRandomTile(Type,Pool, TPool, Size),
                                                createTile(Hand, Player, Type),
                                                Num1 is Num -1,
                                                getPlayerStartHand(Player, Hands, Num1,TPool,NewPool, PoolSize).
getPlayerStartHand(Player, Hand, Pool, NewPool, PoolSize):- getPlayerStartHand(Player, Hand, 2, Pool, NewPool, PoolSize).



removeTilePlayerHand(Tile, [Hand|Hands], Hands, 0):- assignTile(Hand, Tile).
removeTilePlayerHand(Tile, [Hand|Hands], [Hand|NewHands], TileNum):- TileNum > 0, TileNum < 3,
                                                                        TileNum1 is TileNum -1,
                                                                        removeTilePlayerHand(Tile, Hands, NewHands, TileNum1).

addTilePlayerHand(Pool, PoolSize, NewPool, Player, Hand, NewHand):- getRandomTile(Type, Pool, NewPool, PoolSize), createTile(Tile, Player, Type), append([Tile], Hand, NewHand), nl.


tph([tile(a,t2,r), tile(a,t2,l)]).


getTilePoint(Tile, Value):- getTile(Tile, Type), integer(Type), Value is Type.
getTilePoint(_, Value):- Value is 0.


updatePoints(Base, Sum, Total):- Total is Base + Sum.

sumPoints(a, PointsA, PointsB, NewPointsA, PointsB, Value):- updatePoints(PointsA, Value, NewPointsA). % TODO - fix NewPointsA assignement
sumPoints(b, PointsA, PointsB, PointsA, NewPointsB, Value):- updatePoints(PointsB, Value, NewPointsB).
sumPoints(_, PointsA, PointsB, PointsA, PointsB, _).

totalPointsLine([], PlA, PlB, PlA, PlB).
totalPointsLine([Line|LineS], PlA, PlB, ScA, ScB):- getTilePoint(Line, Value),
                                                    getPlayer(Line, Player),
                                                    sumPoints(Player, PlA, PlB, RA, RB, Value),
                                                    totalPointsLine(LineS, RA, RB, ScA, ScB).

totalPoints([], PlA,PlB, PlA, PlB).
totalPoints([Board|BoardS], PlA, PlB, ScA, ScB):- totalPointsLine(Board, PlA, PlB, RLA, RLB),
                                                  totalPoints(BoardS, RLA, RLB, ScA, ScB).
totalPoints(Board, ScoreA, ScoreB):- totalPoints(Board, 0, 0, ScoreA, ScoreB).




rotateTile(tile(P, t1, _), NewTile):- getTileDirection(t1, Dir), assignTile(tile(P, t1, Dir), NewTile).
rotateTile(tile(P, t2, _), NewTile):- getTileDirection(t2, Dir), assignTile(tile(P, t2, Dir), NewTile).
rotateTile(tile(P, t3, _), NewTile):- getTileDirection(t3, Dir), assignTile(tile(P, t3, Dir), NewTile).
rotateTile(tile(P, t4, D), tile(P, t4, D)).
rotateTile(tile(P, t8, D), tile(P, t8, D)).

/* GAME

Inicializaçao

repeat:
        jogar,
        fim de jogo,
      Mostar Resultados
*/



main:-confGame(GameType),
      (GameType = 1 -> pvp
        ;
       GameType = 2 -> pvb
      ).

playerListOp([['A' , 'B'], ['B', 'A']]).
pickFirstPlayer(0, Order):- playerListOp([Order|_]).
pickFirstPlayer(1, Order):- playerListOp([_|[Order]]).
drawFirstPlayer([Pl|Ps]):- random(0, 2, P), pickFirstPlayer(P, [Pl|Ps]).






getPlayerFromPlace(Board, Player, Line, Column):- getTileBoard(Board, Line, Column, Tile), getPlayer(Tile, Player).
getTypeFromPlace(Board, Type, Line, Column):- getTileBoard(Board, Line, Column, Tile), getTile(Tile, Type).
getDirectionFromPlace(Board, Direction, Line, Column):- getTileBoard(Board, Line, Column, Tile), getDirection(Tile, Direction).

isAttacking(Board, tile(P,t1, u), Line, Col):- Line > 0, LineU is Line - 1, getPlayerFromPlace(Board, Player, LineU, Col), Player \= P, Player \= e,
                                                                               getTypeFromPlace(Board, Type, LineU, Col), \+integer(Type).
isAttacking(Board, tile(P,t1, d), Line, Col):- Line < 5, LineD is Line + 1, getPlayerFromPlace(Board, Player, LineD, Col), Player \= P, Player \= e,
                                                                               getTypeFromPlace(Board, Type, LineD, Col), \+integer(Type).
isAttacking(Board, tile(P,t1, r), Line, Col):- Col <  5, ColR is Col + 1, getPlayerFromPlace(Board, Player, Line, ColR), Player \= P, Player \= e,
                                                                             getTypeFromPlace(Board, Type, Line, ColR), \+integer(Type).
isAttacking(Board, tile(P,t1, l), Line, Col):- Col >  0, ColL is Col - 1, getPlayerFromPlace(Board, Player, Line, ColL), Player \= P, Player \= e,
                                                                             getTypeFromPlace(Board, Type, Line, ColL), \+integer(Type).

isAttacking(Board, tile(P,t2, r), Line, Col):- (LineUL is Line - 1, ColUL is Col -1, getPlayerFromPlace(Board, Player, LineUL, ColUL), Player \= P, Player \= e,
                                                                                       getTypeFromPlace(Board, Type, LineUL, ColUL), \+integer(Type));
                                                  (LineDR is Line + 1, ColDR is Col +1, getPlayerFromPlace(Board, Player, LineDR, ColDR), Player \= P, Player \= e,
                                                                                        getTypeFromPlace(Board, Type, LineDR, ColDR), \+integer(Type)).

isAttacking(Board, tile(P,t2, l), Line, Col):- (LineDL is Line + 1, ColDL is Col -1, getPlayerFromPlace(Board, Player, LineDL, ColDL), Player \= P, Player \= e,
                                                                                        getTypeFromPlace(Board, Type, LineDL, ColDL), \+integer(Type));
                                                  (LineUR is Line - 1, ColUR is Col +1, getPlayerFromPlace(Board, Player, LineUR, ColUR), Player \= P, Player \= e,
                                                                                        getTypeFromPlace(Board, Type, LineUR, ColUR), \+integer(Type)).

isAttacking(Board, tile(P,t3, l), Line, Col):- isAttacking(Board, tile(P,t1, u), Line, Col);
                                                  isAttacking(Board, tile(P,t1, l), Line, Col);
                                                  isAttacking(Board, tile(P,t1, d), Line, Col).

isAttacking(Board, tile(P,t3, u), Line, Col):- isAttacking(Board, tile(P,t1, u), Line, Col);
                                                  isAttacking(Board, tile(P,t1, l), Line, Col);
                                                  isAttacking(Board, tile(P,t1, r), Line, Col).

isAttacking(Board, tile(P,t3, r), Line, Col):- isAttacking(Board, tile(P,t1, u), Line, Col);
                                                  isAttacking(Board, tile(P,t1, r), Line, Col);
                                                  isAttacking(Board, tile(P,t1, d), Line, Col).

isAttacking(Board, tile(P,t3, d), Line, Col):- isAttacking(Board, tile(P,t1, r), Line, Col);
                                                  isAttacking(Board, tile(P,t1, d), Line, Col);
                                                  isAttacking(Board, tile(P,t1, l), Line, Col).

isAttacking(Board, tile(P,t4, _), Line, Col):- isAttacking(Board, tile(P,t2, l), Line, Col);
                                                  isAttacking(Board, tile(P,t2, r), Line, Col).

isAttacking(Board, tile(P,t8, _), Line, Col):-  isAttacking(Board, tile(P,t4, u), Line, Col);
                                                   isAttacking(Board, tile(P,t3, u), Line, Col);
                                                   isAttacking(Board, tile(P,t3, d), Line, Col).

validPlacement(Board, tile(P, Tile, Dir), Line, Col):- emptyPlace(Board, Line, Col), isAttacking(Board, tile(P, Tile, Dir), Line, Col).




attack(Board, tile(P, t1, u), Line, Col, NewBoard):- LineU is Line - 1, getPlayerFromPlace(Board, Player, LineU, Col), Player \= P, Player \= e,
                                                                        getTypeFromPlace(Board, Type, LineU, Col), \+integer(Type),
                                                                        getDirectionFromPlace(Board, Direction, LineU, Col),
                                                                        NewTile = tile(P, Type, Direction),
                                                                        placeTile(Board, tile(P, t1, u), Line, Col, IBoard),
                                                                        placeTile(IBoard, NewTile, LineU, Col, NewBoard).

attack(Board, tile(P, t1, d), Line, Col, NewBoard):- LineD is Line + 1, getPlayerFromPlace(Board, Player, LineD, Col), Player \= P, Player \= e,
                                                                        getTypeFromPlace(Board, Type, LineD, Col), \+integer(Type),
                                                                        getDirectionFromPlace(Board, Direction, LineD, Col),
                                                                        NewTile = tile(P, Type, Direction),
                                                                        placeTile(Board, tile(P, t1, d), Line, Col, IBoard),
                                                                        placeTile(IBoard, NewTile, LineD, Col, NewBoard).

attack(Board, tile(P, t1, r), Line, Col, NewBoard):- ColR is Col + 1,  getPlayerFromPlace(Board, Player, Line, ColR), Player \= P, Player \= e,
                                                                        getTypeFromPlace(Board, Type, Line, ColR), \+integer(Type),
                                                                        getDirectionFromPlace(Board, Direction, Line, ColR),
                                                                        NewTile = tile(P, Type, Direction),
                                                                        placeTile(Board, tile(P, t1, r), Line, Col, IBoard),
                                                                        placeTile(IBoard, NewTile, Line, ColR, NewBoard).

attack(Board, tile(P, t1, l), Line, Col, NewBoard):- ColL is Col - 1, getPlayerFromPlace(Board, Player, Line, ColL), Player \= P, Player \= e,
                                                                        getTypeFromPlace(Board, Type, Line, ColL), \+integer(Type),
                                                                        getDirectionFromPlace(Board, Direction, Line, ColL),
                                                                        NewTile = tile(P, Type, Direction),
                                                                        placeTile(Board, tile(P, t1, l), Line, Col, IBoard),
                                                                        placeTile(IBoard, NewTile, Line, ColL, NewBoard).

attack(Board, tile(P,t2, r), Line, Col, NewBoard):- LineUL is Line - 1, ColUL is Col - 1, LineDR is Line + 1, ColDR is Col +1,
                                                    ((getPlayerFromPlace(Board, Player, LineUL, ColUL), Player \= P, Player \= e,
                                                                                getTypeFromPlace(Board, Type, LineUL, ColUL), \+integer(Type)),
                                                    (getPlayerFromPlace(Board, Player, LineDR, ColDR), Player \= P, Player \= e,
                                                                                getTypeFromPlace(Board, Type2, LineDR, ColDR), \+integer(Type2)),
                                                            getDirectionFromPlace(Board, DirectionUL, LineUL, ColUL),
                                                            getDirectionFromPlace(Board, DirectionDR, LineDR, ColDR),
                                                            TileUL = tile(P, Type, DirectionUL),
                                                            TileDR = tile(P, Type2, DirectionDR),
                                                            placeTile(Board, tile(P, t2, r), Line, Col, IBoard),
                                                            placeTile(IBoard, TileUL, LineUL, ColUL, IBoard2),
                                                            placeTile(IBoard2, TileDR, LineDR, ColDR, NewBoard));
                                                    (LineUL is Line - 1, ColUL is Col - 1, getPlayerFromPlace(Board, Player, LineUL, ColUL), Player \= P, Player \= e,
                                                                                getTypeFromPlace(Board, Type, LineUL, ColUL), \+integer(Type),
                                                            getDirectionFromPlace(Board, DirectionUL, LineUL, ColUL),
                                                            TileUL = tile(P, Type, DirectionUL),
                                                            placeTile(Board, tile(P, t2, r), Line, Col, IBoard),
                                                            placeTile(IBoard, TileUL, LineUL, ColUL, NewBoard));
                                                    (LineDR is Line + 1, ColDR is Col +1, getPlayerFromPlace(Board, Player, LineDR, ColDR), Player \= P, Player \= e,
                                                                                getTypeFromPlace(Board, Type3, LineDR, ColDR), \+integer(Type3),
                                                            getDirectionFromPlace(Board, DirectionDR, LineDR, ColDR),
                                                            TileDR = tile(P, Type3, DirectionDR),
                                                            placeTile(Board, tile(P, t2, r), Line, Col, IBoard),
                                                            placeTile(IBoard, TileDR, LineDR, ColDR, NewBoard)).

attack(Board, tile(P,t2, l), Line, Col, NewBoard):- LineUR is Line - 1, ColUR is Col + 1, LineDL is Line + 1, ColDL is Col - 1,
                                                    ((getPlayerFromPlace(Board, Player, LineUR, ColUR), Player \= P, Player \= e,
                                                                                getTypeFromPlace(Board, Type, LineUR, ColUR), \+integer(Type)),
                                                     (getPlayerFromPlace(Board, Player, LineDL, ColDL), Player \= P, Player \= e,
                                                                                getTypeFromPlace(Board, Type2, LineDL, ColDL), \+integer(Type2)),
                                                            getDirectionFromPlace(Board, DirectionUR, LineUR, ColUR),
                                                            getDirectionFromPlace(Board, DirectionDL, LineDL, ColDL),
                                                            TileUR = tile(P, Type, DirectionUR),
                                                            TileDL = tile(P, Type2, DirectionDL),
                                                            placeTile(Board, tile(P, t2, l), Line, Col, IBoard),
                                                            placeTile(IBoard, TileUR, LineUR, ColUR, IBoard2),
                                                            placeTile(IBoard2, TileDL, LineDL, ColDL, NewBoard));
                                                    (LineUR is Line - 1, ColUR is Col + 1, getPlayerFromPlace(Board, Player, LineUR, ColUR), Player \= P, Player \= e,
                                                                                           getTypeFromPlace(Board, Type, LineUR, ColUR), \+integer(Type),
                                                            getDirectionFromPlace(Board, DirectionUR, LineUR, ColUR),
                                                            TileUR = tile(P, Type, DirectionUR),
                                                            placeTile(Board, tile(P, t2, l), Line, Col, IBoard),
                                                            placeTile(IBoard, TileUR, LineUR, ColUR, NewBoard));
                                                    (LineDL is Line + 1, ColDL is Col - 1, getPlayerFromPlace(Board, Player, LineDL, ColDL), Player \= P, Player \= e,
                                                                                        getTypeFromPlace(Board, Type3, LineDL, ColDL), \+integer(Type3),
                                                                                getDirectionFromPlace(Board, DirectionDL, LineDL, ColDL),
                                                            TileDL = tile(P, Type3, DirectionDL),
                                                            placeTile(Board, tile(P, t2, l), Line, Col, IBoard),
                                                            placeTile(IBoard, TileDL, LineDL, ColDL, NewBoard)).


attack(Board, tile(P,t3, l), Line, Col, NewBoard):- attack(Board, tile(P,t1, d), Line, Col, NewBoard1),
                                                    attack(NewBoard1, tile(P,t1, l), Line, Col, NewBoard2),
                                                    attack(NewBoard2, tile(P,t1, u), Line, Col, NewBoard3),
                                                    placeTile(NewBoard3, tile(P, t3, l), Line, Col, NewBoard).

attack(Board, tile(P,t3, u), Line, Col, NewBoard):- attack(Board, tile(P,t1, l), Line, Col, NewBoard1),
                                                    attack(NewBoard1, tile(P,t1, u), Line, Col, NewBoard2),
                                                    attack(NewBoard2, tile(P,t1, r), Line, Col, NewBoard3),
                                                    placeTile(NewBoard3, tile(P, t3, u), Line, Col, NewBoard).

attack(Board, tile(P,t3, r), Line, Col, NewBoard):- attack(Board, tile(P,t1, u), Line, Col, NewBoard1),
                                                    attack(NewBoard1, tile(P,t1, r), Line, Col, NewBoard2),
                                                    attack(NewBoard2, tile(P,t1, d), Line, Col, NewBoard3),
                                                    placeTile(NewBoard3, tile(P, t3, r), Line, Col, NewBoard).

attack(Board, tile(P,t3, d), Line, Col, NewBoard):- attack(Board, tile(P,t1, r), Line, Col, NewBoard1),
                                                    attack(NewBoard1, tile(P,t1, d), Line, Col, NewBoard2),
                                                    attack(NewBoard2, tile(P,t1, l), Line, Col, NewBoard3),
                                                    placeTile(NewBoard3, tile(P, t3, d), Line, Col, NewBoard).

attack(Board, tile(P,t4, _), Line, Col, NewBoard):- (attack(Board, tile(P,t2, l), Line, Col, NewBoard1),
                                                                                                        attack(NewBoard1, tile(P, t2, r), Line, Col, NewBoard2),
                                                                                                        placeTile(NewBoard2, tile(P, t4, u), Line, Col, NewBoard));
                                                                                                        (
                                                                                                        attack(Board, tile(P,t2, l), Line, Col, NewBoard1),
                                                                                                        placeTile(NewBoard1, tile(P, t4, u), Line, Col, NewBoard)
                                                                                                        );
                                                                                                        (
                                                                                                        attack(Board, tile(P, t2, r), Line, Col, NewBoard2),
                                                                                                        placeTile(NewBoard2, tile(P, t4, u), Line, Col, NewBoard)
                                                                                                        ).

attack(Board, tile(P,t8, _), Line, Col, NewBoard):- attack(Board, tile(P,t4, u), Line, Col, NewBoard1),
                                                    attack(NewBoard1, tile(P,t3, u), Line, Col, NewBoard2),
                                                    attack(NewBoard2, tile(P,t1, d), Line, Col, NewBoard3),

                                                    placeTile(NewBoard3, tile(P, t8, u), Line, Col, NewBoard).

                                                    attack(Board, tile(_, t1, _), _, _, Board).
                                                    attack(Board, tile(_, t4, _), _, _, Board).


playerStartTurn(Player,Board,NewBoard):-repeat,
                                        getNewTileCoord(Col, Row),
                                        emptyPlace(Board,Row,Col),
                                        placeTile(Board, tile(Player,t10,u), Row, Col, NewBoard).




startGame(B3, P1Hand, P2Hand, PoolF, [P1|[P2]]):-
    board(B), tilePool(Pool),%TODO CHANGE
    drawFirstPlayer([P1|[P2]]),
    getPlayerStartHand(P1, P1Hand, Pool, NewPool, 36),
    getPlayerStartHand(P2, P2Hand, NewPool, PoolF, 33),nl,
    displayBoard(B), nl,
    showStarterPlayer(P1), nl,
    showPlace2STiles(P1),

    %P1 places 2 type 10tiles
    playerStartTurn(P1,B,B1),
    displayBoard(B1), nl,
    playerStartTurn(P1,B1,B2),

    displayBoard(B2), nl,

    %P2 places 1 type 10 tile
    showPlace1STiles(P2),
    playerStartTurn(P2,B2,B3),

    displayBoard(B3), nl.


playerTurn(Player, PHand, PNHand, Board, NewBoard,PoolSize,NPoolSize,TilePool,NTilePool):-
                                                   displayPlayerHand(PHand, Player),
                                                   repeat,
                                                   getNumTile(P1TN),
                                                   removeTilePlayerHand(Tile, PHand, NP1Hand, P1TN),
                                                   getNewTileCoord(P1C, P1R),
                                                   rotateTile(Tile, RTile),
                                                  (
                                                   (
                                                     listValidMoves(Board,Result,Player,PHand),
                                                     Result == [],
                                                     emptyPlace(Board,P1R,P1C),
                                                     placeTile(Board, RTile, P1R, P1C, Board1)
                                                   );
                                                   (
                                                     validPlacement(Board, RTile, P1R, P1C),
                                                     attack(Board, RTile, P1R, P1C, Board1)
                                                   )
                                                  ),!,

                                                   addTilePlayerHand(TilePool, PoolSize, NTilePool, Player, NP1Hand, PNHand),
                                                   surroundedTiles(Board1,NewBoard,0,Board1),
                                                   NPoolSize is PoolSize - 1.


game(Board, P1Hand, P2Hand, TilePool, PoolSize, [P1|[P2]]):-

    playerTurn(P1, P1Hand, NNP1Hand, Board, Board1,PoolSize, PoolSize1, TilePool,TilePool1),

    displayBoard(Board1), nl,

    playerTurn(P2, P2Hand, NNP2Hand, Board1, NewBoard,PoolSize1, PoolSize2, TilePool1,TilePool2),

    displayBoard(NewBoard), nl,

    !,(
        gameEnded(NewBoard,P1,P2)
        ;
        !,game(NewBoard, NNP1Hand, NNP2Hand, TilePool2, PoolSize2, [P1|[P2]])
      ).

/*
selectTile([Hand|HandS], 0, Hand).
selectTile([Hand|HandS], Num, Tile):- Num1 is Num - 1,
                                      selectTile(HandS, Num1, Tile).
*/
pvp:- startGame(Board, P1Hand, P2Hand, TPool, Players), game(Board, P1Hand, P2Hand, TPool, 30, Players).

gameEnded(Board, P1, P2):- boardFull(Board), !, totalPoints(Board, ScoreA, ScoreB), showWinner(P1, P2, ScoreA, ScoreB), nl, showScore(P1, P2, ScoreA, ScoreB), !.





botGame(Board, P1Hand, P2Hand, TilePool, PoolSize, [P1|[P2]]):-
      playerTurn(P1, P1Hand, NNP1Hand, Board, Board1,PoolSize, PoolSize1, TilePool,TilePool1),

      displayBoard(Board1), nl,


      !,botLevel1Turn(Board1,NewBoard,P2,P2Hand,NNP2Hand,TilePool1,PoolSize1,TilePool2),
      PoolSize2 is PoolSize1 - 1,
      displayBoard(NewBoard), nl,

      !,(
          gameEnded(NewBoard,P1,P2)
          ;
          !,botGame(NewBoard, NNP1Hand, NNP2Hand, TilePool2, PoolSize2, [P1|[P2]])
        ).



pvb:-startGame(Board, P1Hand, P2Hand, TPool, Players), botGame(Board, P1Hand, P2Hand, TPool, 30, Players).
