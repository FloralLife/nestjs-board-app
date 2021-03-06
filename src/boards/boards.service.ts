import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { v1 as uuid } from 'uuid';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(@InjectRepository(BoardRepository) private boardRepository: BoardRepository) {}

  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  getSomeoneBoards(userId: number): Promise<Board[]> {
    return this.boardRepository.find({ where: { user: userId } });
  }

  async getBoardById(id: number): Promise<Board> {
    const result = await this.boardRepository.findOne(id);
    if (!result) throw new NotFoundException(`Can't find board with id ${id}`);
    return result;
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({ id, user });
    if (result.affected === 0) throw new NotFoundException(`Can't find Board with id ${id}`);
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);

    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }

  // private boards: Board[] = [];
  // getAllBoards(): Board[] {
  //   return this.boards;
  // }
  // createBoard(createBoardDto: CreateBoardDto): Board {
  //   const { title, description } = createBoardDto;
  //   const board: Board = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC
  //   };
  //   this.boards.push(board);
  //   return board;
  // }
  // getBoardById(id: string): Board {
  //   const result = this.boards.find(board => board.id === id);
  //   if (!result) throw new NotFoundException(`Can't find Board with id ${id}`);
  //   return result;
  // }
  // deleteBoard(id: string): void {
  //   const result = this.getBoardById(id);
  //   this.boards = this.boards.filter(board => board.id !== result.id);
  // }
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
}
