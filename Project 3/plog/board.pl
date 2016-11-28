/*
Player -> Player Representation
Type -> Tile number ( 1,2,3,4,8,10).
Direction-> u,d,l,r
*/
tile(_,_,_).

board([[tile(e,e,e),     tile(e,e,e), tile(e,e,e), tile(e,e,e), tile(e,e,e),  tile(e,e,e)],
        [tile(e,e,e),     tile(e,e,e), tile(e,e,e), tile(e,e,e), tile(e,e,e),  tile(e,e,e)],
        [tile(e,e,e),     tile(e,e,e), tile(e,e,e), tile(e,e,e), tile(e,e,e),  tile(e,e,e)],
        [tile(e,e,e),     tile(e,e,e), tile(e,e,e), tile(e,e,e), tile(e,e,e),  tile(e,e,e)],
        [tile(e,e,e),     tile(e,e,e), tile(e,e,e), tile(e,e,e), tile(e,e,e),  tile(e,e,e)],
        [tile(e,e,e),     tile(e,e,e), tile(e,e,e), tile(e,e,e), tile(e,e,e),  tile(e,e,e)]]).

testboard([[tile('A',t1,u),     tile('A', 1,l), tile('A',1,r), tile('A',t1,d), tile('A',8,s),  tile('A',t4,e)],
           [tile('A',t2,l),     tile('A',t2,l), tile('A',t2,r), tile('A',t2,r), tile('A',8,s),  tile('A',t4,e)],
           [tile('A',t3,u),     tile('A',t3,l), tile('A',3,r), tile('A',t3,d), tile('A',t8,s),  tile('A',t4,e)],
           [tile('A',t4,u),     tile('A',t4,l), tile('A',t4,r), tile('A',t4,d), tile('A',8,s),  tile('A',4,e)],
           [tile('A',t8,u),     tile('A',t8,l), tile('A',8,r), tile('A',t8,d), tile('A',8,s),  tile(e,e,e)],
           [tile('A',t10,u),    tile('A',t10,l),tile('A',t4,r),tile('A',t10,d),tile('A', 8, s),  tile('A', 8, s)]]).


finalboard([[tile('A',1,u),     tile('A',1,l), tile('A',1,r), tile('A',1,d), tile('A',1,e),  tile('A',1,e)],
            [tile('A',2,l),     tile('A',2,l), tile('A',2,r), tile('A',2,r), tile('A',1,e),  tile('A',1,e)],
            [tile('A',3,u),     tile('A',3,l), tile('A',3,r), tile('A',3,d), tile('A',1,e),  tile('A',1,e)],
            [tile('B',4,u),     tile('A',4,l), tile('A',4,r), tile('A',4,d), tile('A',1,e),  tile('A',1,e)],
            [tile('A',8,u),     tile('A',8,l), tile('A',8,r), tile('A',8,d), tile('A',1,e),  tile('A',1,e)],
            [tile('A',10,u),    tile('A',10,l),tile('A',10,r),tile('A',10,d),tile('A',1,e),  tile('A',1,e)]]).


display_board([],_):-nl.
display_board([L1|Ls], N):- write('  |'),
                                     display_line_p1(L1),
                                     write(N),
                                     write(' |'),
                                     display_line_p2(L1),
                                     write('  |'),
                                     display_line_p3(L1),
                                     display_line_separators, nl ,
                                     N1 is N + 1,
                                     display_board(Ls, N1).


display_line_p1([]):-nl.
display_line_p1([E|Es]):- display_tile_p1(E),
                          write('|'),
                          display_line_p1(Es).




display_line_p2([]):-nl.
display_line_p2([E|Es]):- display_tile_p2(E),
                          write('|'),
                          display_line_p2(Es).



display_line_p3([]):- nl.
display_line_p3([E|Es]):- display_tile_p3(E),
                          write('|'),
                          display_line_p3(Es).

display_tile_p1(tile(_,t1,u)):-draw_tile1_MV.
display_tile_p1(tile(_,t1,_)):-draw_empty.
display_tile_p1(tile(_,t2,l)):-draw_tile2_1RL.
display_tile_p1(tile(_,t2,r)):-draw_tile2_1LR.
display_tile_p1(tile(_,t3,d)):-draw_empty.
display_tile_p1(tile(_,t3,_)):-draw_tile1_MV.
display_tile_p1(tile(_,t4,_)):-draw_tile4_1.
display_tile_p1(tile(_,t8,_)):-draw_tile8_1.
display_tile_p1(tile(_,t10,_)):-draw_tile10_1.
display_tile_p1(tile(_,_,_)):-draw_empty.

display_tile_p2(tile(P,t1,u)):-draw_empty(P).
display_tile_p2(tile(P,t1,r)):-draw_tile1_MHR(P).
display_tile_p2(tile(P,t1,d)):-draw_empty(P).
display_tile_p2(tile(P,t1,l)):-draw_tile1_MHL(P).
display_tile_p2(tile(P,t2,_)):-draw_empty(P).
display_tile_p2(tile(P,t3,r)):-draw_tile1_MHR(P).
display_tile_p2(tile(P,t3,l)):-draw_tile1_MHL(P).
display_tile_p2(tile(P,t3,_)):-draw_tile3_2(P).
display_tile_p2(tile(P,t4,_)):-draw_tile4_2(P).
display_tile_p2(tile(P,t8,_)):-draw_tile8_2(P).
display_tile_p2(tile(P,t10,_)):-draw_tile10_2(P).
display_tile_p2(tile(e,_,_)):-draw_empty.
display_tile_p2(tile(P,_,_)):-draw_final_tile(P).


display_tile_p3(tile(_,t1,d)):-draw_tile1_MV.
display_tile_p3(tile(_,t1,_)):-draw_empty.
display_tile_p3(tile(_,t2,r)):-draw_tile2_3LR.
display_tile_p3(tile(_,t2,l)):-draw_tile2_3RL.
display_tile_p3(tile(_,t3,u)):-draw_empty.
display_tile_p3(tile(_,t3,_)):-draw_tile1_MV.
display_tile_p3(tile(_,t4,_)):-draw_tile4_3.
display_tile_p3(tile(_,t8,_)):-draw_tile8_3.
display_tile_p3(tile(_,t10,_)):-draw_tile10_3.
display_tile_p3(tile(_,_,_)):-draw_empty.

display_line_separators:- write('  -------------------------------------').
display_first_line:- write('     A     B     C     D     E     F'), nl,
                     display_line_separators, nl.


draw_tile8_1:- write(''\' | /').
draw_tile8_2(P):- write('--'), write(P), write('--').
draw_tile8_3:- write('/ | '\'').

draw_tile1_MV:- write('  |  ').
draw_tile1_MHL(P):-write('--'),write(P),write('  ').
draw_tile1_MHR(P):-write('  '),write(P),write('--').

draw_empty:- write('     ').
draw_empty(P):-write('  '),write(P),write('  ').

draw_tile2_1LR:- write(''\'    ').
draw_tile2_3LR:- write('    '\'').
draw_tile2_1RL:- write('    /').
draw_tile2_3RL:- write('/    ').

draw_tile3_2(P):-write('--'),write(P),write('--').

draw_tile4_1:- write(''\'   /').
draw_tile4_2(P):- write('  '), write(P), write('  ').
draw_tile4_3:- write('/   '\'').

draw_tile10_1:- write('@ @ @').
draw_tile10_2(P):-write('@ '), write(P), write(' @').
draw_tile10_3:- write('@ @ @').

draw_final_tile(P):-write('  '), write(P), write('  ').


/*Pool dee Soldados*/
tilePool([t1,t1,t1,t1,t1,t1,t1,
          t2,t2,t2,t2,t2,t2,t2,
          t3,t3,t3,t3,t3,t3,t3,
          t4,t4,t4,t4,t4,t4,t4,
          t8,t8,t8,t8,t8,t8,t8]).
   % 3 peças  starter ( tipo X )
   % total 39 peças

/*Jogadas a implementar */

/*criaçao do jogo*/
%draw_start_hand(T). % buscar 3 Soldado aleatorios á pool
                    % para a mao do jogador

% dar iron tiles aos jogadores 2 ao 1º, 1 ao 2º.
%place_p10_tile(Location,Player).% colocar iron tiles no tabuleiro


/*Inicio de turno*/

%placeTile(Tile,Player,Col,Line). %colocar um soldado da mao Soldado no tabuleiro

/*Jogadas de ataque  */
%attack(Peca). % atacar as peças á volta ( trocar o dono da peça)

/*Casas bloqueadas */
%surrounded_tiles(Pecas). %casas bloqueadas em todas as direçoes

/*Conquistar casas*/
%conquest_tile(Peca). % remover peca  e deixar marca do Jogador

/*final do turno*/
%getSoldier(S). % retirar  um Soldado aleatorio á pool.


/*Game end */
% todos os quadrados atribuidos a jogadores  e sem pecas em campo.


/* retorna peça numa posicao */
getTileBoardL([E1|_],0, Tile):- assignTile(Tile,E1).
getTileBoardL([_|Es],Col,Tile):- Col > 0,
                                 Col1 is Col -1,
                                 getTileBoardL(Es,Col1,Tile).

getTileBoard([L1|_],0,Col,Tile):- getTileBoardL(L1,Col,Tile).
getTileBoard([_|Ls],Line,Col,Tile):-Line > 0,
                                    Line1 is Line -1,
                                    getTileBoard(Ls,Line1,Col,Tile).
/* testa se posicao esta vazia */
emptyPlace(Board,Row, Col):- getTileBoard(Board,Row,Col,Tile),
                             getTile(Tile,Test),
                             Test == e.
/*_____________________*/

/* testa se o board ta completo */
boardFull([]).
boardFull([L1|Ls]):-boardFullLine(L1),!,boardFull(Ls).

boardFullLine([]).
boardFullLine([E1|Es]):- getTile(E1,T), integer(T),!, boardFullLine(Es).
/*_____________________*/

/* detectar e processar Tiles rodeados*/


surroundedTiles([],_,_,_).
surroundedTiles([L1|Ls], [L1N|LsN],Row,Board):-surroundedTilesLine(L1,L1N,0,Row,Board),
                                               Row1 is Row + 1,
                                               surroundedTiles(Ls,LsN,Row1,Board).

surroundedTilesLine([],_,_,_,_).
surroundedTilesLine([E1|Es],[E1N|EsN],Col,Row,Board):-      ( checkEmpty(E1) ; checkConquered(E1) ),!,
                                                            assignTile(E1,E1N),
                                                            Col1 is Col +1,
                                                            surroundedTilesLine(Es,EsN,Col1,Row,Board).

surroundedTilesLine([E1|Es],[E1N|EsN],Col,Row,Board):-   Col1 is Col +1,
                                                         Row1 is Row +1,
                                                         Row2 is Row -1,
                                                         Col2 is Col -1,

                                                         assertLeft(Board,Row,Col2),
                                                         assertRigth(Board,Row,Col1),
                                                         assertUp(Board,Row2,Col),
                                                         assertUpL(Board,Row2,Col2),
                                                         assertUpR(Board,Row2,Col1),
                                                         assertDown(Board,Row1,Col),
                                                         assertDownL(Board,Row1,Col2),
                                                         assertDownR(Board,Row1,Col1),!,


                                                        changeToFinal(E1,E1N),

                                                        surroundedTilesLine(Es,EsN,Col1,Row,Board).

surroundedTilesLine([E1|Es],[E1N|EsN],Col,Row,Board):- Col1 is Col +1,
                                                       assignTile(E1,E1N),
                                                       surroundedTilesLine(Es,EsN,Col1,Row,Board).





checkEmpty(E1):-getTile(E1,T),
                 T=e.

checkNotEmpty(E1):-getTile(E1,T),
                    T \== e.

checkConquered(E1):-getTile(E1,T),
                    integer(T).

assertNotEmpty(Board, Row, Col):-getTileBoard(Board,Row,Col,Tile), checkNotEmpty(Tile).

assertLeft(_,_,Col):- Col < 0.
assertLeft(Board,Row,Col):- assertNotEmpty(Board,Row,Col).

assertRigth(_,_,Col):- Col > 5.
assertRigth(Board,Row,Col):- assertNotEmpty(Board,Row,Col).

assertUp(_,Row,_):- Row < 0.
assertUp(Board,Row,Col):-    assertNotEmpty(Board,Row,Col).

assertUpL(_,_,Col):- Col < 0.
assertUpL(_,Row,_):-   Row < 0.
assertUpL(Board,Row,Col):-   assertNotEmpty(Board,Row,Col).

assertUpR(_,_,Col):-   Col > 5.
assertUpR(_,Row,_):-   Row < 0.
assertUpR(Board,Row,Col):-   assertNotEmpty(Board,Row,Col).

assertDown(_,Row,_):-  Row > 5.
assertDown(Board,Row,Col):-  assertNotEmpty(Board,Row,Col).

assertDownL(_,_,Col):- Col < 0.
assertDownL(_,Row,_):- Row > 5.
assertDownL(Board,Row,Col):- assertNotEmpty(Board,Row,Col).

assertDownR(_,_,Col):- Col > 5.
assertDownR(_,Row,_):- Row > 5.
assertDownR(Board,Row,Col):- assertNotEmpty(Board,Row,Col).
/*_____________________*/


finalValue(t10,10).
finalValue(t8,8).
finalValue(t4,4).
finalValue(t3,3).
finalValue(t2,2).
finalValue(t1,1).

changeToFinal(E1,E1N):-getTile(E1,T), finalValue(T,V), changeValue(E1,V,E1N).
/*____________________*/




maketile(P,T,D, tile(P,T,D)).

/* get info from tile*/
getPlayer(tile(P,_,_),P).
getTile(tile(_,T,_),T).
getDirection(tile(_,_,D),D).

displayBoard(Board):- display_first_line, display_board(Board, 1).


line([tile(a,t1,u),tile(a,t1,l), tile(a,t1,r), tile(a,t1,d), tile(e,e,e),  tile(e,e,e)]).

tLine:-line(X),changeOwnerLine(X,0,b,R),write(R).
tboard:- board(X), changeOwnerBoard(X,1,3,c,R), write(R), nl, display_board(R,1).

tfull:-finalboard(X),boardFull(X).
tempty:-testboard(X),emptyPlace(X,5,1).
tempty2:-testboard(X),emptyPlace(X,5,5).

tsur:-testboard(X),surroundedTiles(X,R,0,X),displayBoard(X),displayBoard(R),nl, write(R).
