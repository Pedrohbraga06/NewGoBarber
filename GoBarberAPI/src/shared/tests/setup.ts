import 'reflect-metadata';
import MockDate from 'mockdate';

// freeze system date to 2022-05-19 12:00 so tests behave deterministically
MockDate.set(new Date(2022, 4, 19, 12, 0, 0));
